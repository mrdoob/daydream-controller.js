/**
 * @author mrdoob / http://mrdoob.com/
 */

function DaydreamController() {

	var state = {};

	function connect() {

		return navigator.bluetooth.requestDevice( {
			filters: [ {
				name: 'Daydream controller'
			} ],
			optionalServices: [ 0xfe55 ]
		} )
		.then( function ( device ) {
			return device.gatt.connect();
		} )
		.then( function ( server ) {
			return server.getPrimaryService( 0xfe55 );
		} )
		.then( function ( service ) {
			return service.getCharacteristic( '00000001-1000-1000-8000-00805f9b34fb' );
		} )
		.then( function ( characteristic ) {
			characteristic.addEventListener( 'characteristicvaluechanged', handleData );
			return characteristic.startNotifications();
		} )

	}

	function handleData( event ) {

		var data = event.target.value;

		// http://stackoverflow.com/questions/40730809/use-daydream-controller-on-hololens-or-outside-daydream/40753551#40753551

		state.isClickDown = (data.getUint8(18) & 0x1) > 0;
		state.isAppDown = (data.getUint8(18) & 0x4) > 0;
		state.isHomeDown = (data.getUint8(18) & 0x2) > 0;
		state.isVolPlusDown = (data.getUint8(18) & 0x10) > 0;
		state.isVolMinusDown = (data.getUint8(18) & 0x8) > 0;

		state.time = ((data.getUint8(0) & 0xFF) << 1 | (data.getUint8(1) & 0x80) >> 7);

		state.seq = (data.getUint8(1) & 0x7C) >> 2;

		state.xOri = (data.getUint8(1) & 0x03) << 11 | (data.getUint8(2) & 0xFF) << 3 | (data.getUint8(3) & 0x80) >> 5;
		state.xOri = (state.xOri << 19) >> 19;
		state.xOri *= (2 * Math.PI / 4095.0);

		state.yOri = (data.getUint8(3) & 0x1F) << 8 | (data.getUint8(4) & 0xFF);
		state.yOri = (state.yOri << 19) >> 19;
		state.yOri *= (2 * Math.PI / 4095.0);

		state.zOri = (data.getUint8(5) & 0xFF) << 5 | (data.getUint8(6) & 0xF8) >> 3;
		state.zOri = (state.zOri << 19) >> 19;
		state.zOri *= (2 * Math.PI / 4095.0);

		state.xAcc = (data.getUint8(6) & 0x07) << 10 | (data.getUint8(7) & 0xFF) << 2 | (data.getUint8(8) & 0xC0) >> 6;
		state.xAcc = (state.xAcc << 19) >> 19;
		state.xAcc *= (8 * 9.8 / 4095.0);

		state.yAcc = (data.getUint8(8) & 0x3F) << 7 | (data.getUint8(9) & 0xFE) >>> 1;
		state.yAcc = (state.yAcc << 19) >> 19;
		state.yAcc *= (8 * 9.8 / 4095.0);

		state.zAcc = (data.getUint8(9) & 0x01) << 12 | (data.getUint8(10) & 0xFF) << 4 | (data.getUint8(11) & 0xF0) >> 4;
		state.zAcc = (state.zAcc << 19) >> 19;
		state.zAcc *= (8 * 9.8 / 4095.0);

		state.xGyro = ((data.getUint8(11) & 0x0F) << 9 | (data.getUint8(12) & 0xFF) << 1 | (data.getUint8(13) & 0x80) >> 7);
		state.xGyro = (state.xGyro << 19) >> 19;
		state.xGyro *= (2048 / 180 * Math.PI / 4095.0);

		state.yGyro = ((data.getUint8(13) & 0x7F) << 6 | (data.getUint8(14) & 0xFC) >> 2);
		state.yGyro = (state.yGyro << 19) >> 19;
		state.yGyro *= (2048 / 180 * Math.PI / 4095.0);

		state.zGyro = ((data.getUint8(14) & 0x03) << 11 | (data.getUint8(15) & 0xFF) << 3 | (data.getUint8(16) & 0xE0) >> 5);
		state.zGyro = (state.zGyro << 19) >> 19;
		state.zGyro *= (2048 / 180 * Math.PI / 4095.0);

		state.xTouch = ((data.getUint8(16) & 0x1F) << 3 | (data.getUint8(17) & 0xE0) >> 5) / 255.0;
		state.yTouch = ((data.getUint8(17) & 0x1F) << 3 | (data.getUint8(18) & 0xE0) >> 5) / 255.0;

		onStateChangeCallback( state );

	}

	function onStateChangeCallback() {}

	//

	return {
		connect: connect,
		onStateChange: function ( callback ) {
			onStateChangeCallback = callback;
		}
	}

}
