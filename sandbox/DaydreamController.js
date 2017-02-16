/**
 * edit: Matteo "xonoxitron" Pisani
 */

 // AHRS
 require=function a(b,c,d){function e(g,h){if(!c[g]){if(!b[g]){var i="function"==typeof require&&require;if(!h&&i)return i(g,!0);if(f)return f(g,!0);var j=new Error("Cannot find module '"+g+"'");throw j.code="MODULE_NOT_FOUND",j}var k=c[g]={exports:{}};b[g][0].call(k.exports,function(a){var c=b[g][1][a];return e(c?c:a)},k,k.exports,a,b,c,d)}return c[g].exports}for(var f="function"==typeof require&&require,g=0;g<d.length;g++)e(d[g]);return e}({"./Madgwick":[function(a,b,c){"use strict";b.exports=function(b,c){function k(a,b,c,d,k,l){var m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H;r=.5*(-g*a-h*b-i*c),s=.5*(f*a+h*c-i*b),t=.5*(f*b-g*c+i*a),u=.5*(f*c+g*b-h*a),0===d&&0===k&&0===l||(m=Math.pow(d*d+k*k+l*l,-.5),d*=m,k*=m,l*=m,v=2*f,w=2*g,x=2*h,y=2*i,z=4*f,A=4*g,B=4*h,C=8*g,D=8*h,E=f*f,F=g*g,G=h*h,H=i*i,n=z*G+x*d+z*F-w*k,o=A*H-y*d+4*E*g-v*k-A+C*F+C*G+A*l,p=4*E*h+v*d+B*H-y*k-B+D*F+D*G+B*l,q=4*F*i-w*d+4*G*i-x*k,m=Math.pow(n*n+o*o+p*p+q*q,-.5),n*=m,o*=m,p*=m,q*=m,r-=e*n,s-=e*o,t-=e*p,u-=e*q),f+=r*j,g+=s*j,h+=t*j,i+=u*j,m=Math.pow(f*f+g*g+h*h+i*i,-.5),f*=m,g*=m,h*=m,i*=m}function l(a,b,c,d,l,m,n,o,p,q){j=q||j;var r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z;return void 0===n||void 0===o||void 0===p||0===n&&0===o&&0===p?void k(a,b,c,d,l,m):(w=.5*(-g*a-h*b-i*c),x=.5*(f*a+h*c-i*b),y=.5*(f*b-g*c+i*a),z=.5*(f*c+g*b-h*a),0===d&&0===l&&0===m||(r=Math.pow(d*d+l*l+m*m,-.5),d*=r,l*=r,m*=r,r=Math.pow(n*n+o*o+p*p,-.5),n*=r,o*=r,p*=r,C=2*f*n,D=2*f*o,E=2*f*p,F=2*g*n,K=2*f,L=2*g,M=2*h,N=2*i,O=2*f*h,P=2*h*i,Q=f*f,R=f*g,S=f*h,T=f*i,U=g*g,V=g*h,W=g*i,X=h*h,Y=h*i,Z=i*i,A=n*Q-D*i+E*h+n*U+L*o*h+L*p*i-n*X-n*Z,B=C*i+o*Q-E*g+F*h-o*U+o*X+M*p*i-o*Z,G=Math.sqrt(A*A+B*B),H=-C*h+D*g+p*Q+F*i-p*U+M*o*i-p*X+p*Z,I=2*G,J=2*H,s=-M*(2*W-O-d)+L*(2*R+P-l)-H*h*(G*(.5-X-Z)+H*(W-S)-n)+(-G*i+H*g)*(G*(V-T)+H*(R+Y)-o)+G*h*(G*(S+W)+H*(.5-U-X)-p),t=N*(2*W-O-d)+K*(2*R+P-l)-4*g*(1-2*U-2*X-m)+H*i*(G*(.5-X-Z)+H*(W-S)-n)+(G*h+H*f)*(G*(V-T)+H*(R+Y)-o)+(G*i-J*g)*(G*(S+W)+H*(.5-U-X)-p),u=-K*(2*W-O-d)+N*(2*R+P-l)-4*h*(1-2*U-2*X-m)+(-I*h-H*f)*(G*(.5-X-Z)+H*(W-S)-n)+(G*g+H*i)*(G*(V-T)+H*(R+Y)-o)+(G*f-J*h)*(G*(S+W)+H*(.5-U-X)-p),v=L*(2*W-O-d)+M*(2*R+P-l)+(-I*i+H*g)*(G*(.5-X-Z)+H*(W-S)-n)+(-G*f+H*h)*(G*(V-T)+H*(R+Y)-o)+G*g*(G*(S+W)+H*(.5-U-X)-p),r=Math.pow(s*s+t*t+u*u+v*v,-.5),s*=r,t*=r,u*=r,v*=r,w-=e*s,x-=e*t,y-=e*u,z-=e*v),f+=w*j,g+=x*j,h+=y*j,i+=z*j,r=Math.pow(f*f+g*g+h*h+i*i,-.5),f*=r,g*=r,h*=r,void(i*=r))}c=c||{};var d=1e3/b,e=c.beta||1,f=1,g=0,h=0,i=0,j=1/d;return{update:l,getQuaternion:function(){return{w:f,x:g,y:h,z:i}}}}},{}],"./Mahony":[function(a,b,c){"use strict";b.exports=function(b,c){function s(a,b,c,d,e,f){var g,h,s,t,u,v,w,x,y,z;0!==d&&0!==e&&0!==f&&(g=Math.pow(d*d+e*e+f*f,-.5),d*=g,e*=g,f*=g,h=m*o-l*n,s=l*m+n*o,t=l*l-.5+o*o,u=e*t-f*s,v=f*h-d*t,w=d*s-e*h,k>0?(p+=k*u*i,q+=k*v*i,r+=k*w*i,a+=p,b+=q,c+=r):(p=0,q=0,r=0),a+=j*u,b+=j*v,c+=j*w),a*=.5*i,b*=.5*i,c*=.5*i,x=l,y=m,z=n,l+=-y*a-z*b-o*c,m+=x*a+z*c-o*b,n+=x*b-y*c+o*a,o+=x*c+y*b-z*a,g=Math.pow(l*l+m*m+n*n+o*o,-.5),l*=g,m*=g,n*=g,o*=g}function t(a,b,c,d,e,f,g,h,t,u){i=u||i;var v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V;return void 0===g||void 0===h||void 0===t||0===g&&0===h&&0===t?void s(a,b,c,d,e,f):(0!==d&&0!==e&&0!==f&&(v=Math.pow(d*d+e*e+f*f,-.5),d*=v,e*=v,f*=v,v=Math.pow(g*g+h*h+t*t,-.5),g*=v,h*=v,t*=v,w=l*l,x=l*m,y=l*n,z=l*o,A=m*m,B=m*n,C=m*o,D=n*n,E=n*o,F=o*o,G=2*(g*(.5-D-F)+h*(B-z)+t*(C+y)),H=2*(g*(B+z)+h*(.5-A-F)+t*(E-x)),I=Math.sqrt(G*G+H*H),J=2*(g*(C-y)+h*(E+x)+t*(.5-A-D)),K=C-y,L=x+E,M=w-.5+F,N=I*(.5-D-F)+J*(C-y),O=I*(B-z)+J*(x+E),P=I*(y+C)+J*(.5-A-D),Q=e*M-f*L+(h*P-t*O),R=f*K-d*M+(t*N-g*P),S=d*L-e*K+(g*O-h*N),k>0?(p+=k*Q*i,q+=k*R*i,r+=k*S*i,a+=p,b+=q,c+=r):(p=0,q=0,r=0),a+=j*Q,b+=j*R,c+=j*S),a*=.5*i,b*=.5*i,c*=.5*i,T=l,U=m,V=n,l+=-U*a-V*b-o*c,m+=T*a+V*c-o*b,n+=T*b-U*c+o*a,o+=T*c+U*b-V*a,v=Math.pow(l*l+m*m+n*n+o*o,-.5),l*=v,m*=v,n*=v,void(o*=v))}c=c||{};var d=c.kp||1,e=c.ki||0,f=1e3/b,g=2*d,h=2*e,i=1/f,j=g,k=h,l=1,m=0,n=0,o=0,p=0,q=0,r=0;return{update:t,getQuaternion:function(){return{w:l,x:m,y:n,z:o}}}}},{}],ahrs:[function(a,b,c){"use strict";function e(b){b=b||{};var e,c=b.sampleInterval||20,d=b.algorithm||"Madgwick";if("Mahony"===d)e=new(a("./Mahony"))(c,b);else{if("Madgwick"!==d)throw new Error("AHRS(): Algorithm not valid: ",d);e=new(a("./Madgwick"))(c,b)}for(var f in e)e.hasOwnProperty(f)&&(this[f]=e[f])}var d=180/Math.PI;e.prototype.toVector=function(){var a=this.getQuaternion(),b=2*Math.acos(a.w),c=Math.sin(b/2);return{angle:b,x:a.x/c,y:a.y/c,z:a.z/c}},e.prototype.getEulerAngles=function(){var a=this.getQuaternion(),b=a.w*a.w,c=a.x*a.x,d=a.y*a.y,e=a.z*a.z;return{heading:Math.atan2(2*(a.x*a.y+a.z*a.w),c-d-e+b),pitch:-Math.asin(2*(a.x*a.z-a.y*a.w)),roll:Math.atan2(2*(a.y*a.z+a.x*a.w),-c-d+e+b)}},e.prototype.getEulerAnglesDegrees=function(){var a=this.getEulerAngles();return{heading:a.heading*d,pitch:a.pitch*d,roll:a.roll*d}},b.exports=e},{"./Madgwick":"./Madgwick","./Mahony":"./Mahony"}]},{},[]);
 const AHRS = require('ahrs');


/**
 * @author mrdoob / http://mrdoob.com/
 */

function DaydreamController() {

	var state = {};

	function connect() {

		navigator.bluetooth.requestDevice( {
			filters: [ {
				name: 'Daydream controller'
			} ],
			optionalServices: [ '0000fe55-0000-1000-8000-00805f9b34fb' ]
		} )
		.then( function ( device ) {
			return device.gatt.connect();
		} )
		.then( function ( server ) {
			return server.getPrimaryService( '0000fe55-0000-1000-8000-00805f9b34fb' );
		} )
		.then( function ( service ) {
			return service.getCharacteristic( '00000001-1000-1000-8000-00805f9b34fb' );
		} )
		.then( function ( characteristic ) {
			characteristic.addEventListener( 'characteristicvaluechanged', handleData );
			characteristic.startNotifications();
		} )

	}

	function handleData( data ) {

		var data = event.target.value;

		// http://stackoverflow.com/questions/40730809/use-daydream-controller-on-hololens-or-outside-daydream

		state.isClickDown = (data.getUint8(18) & 0x1) > 0;
		state.isAppDown = (data.getUint8(18) & 0x4) > 0;
		state.isHomeDown = (data.getUint8(18) & 0x2) > 0;
		state.isVolPlusDown = (data.getUint8(18) & 0x10) > 0;
		state.isVolMinusDown = (data.getUint8(18) & 0x8) > 0;

		state.time = ((data.getUint8(0) & 0xFF) << 1 | (data.getUint8(1) & 0x80) >> 7);

		state.seq = (data.getUint8(1) & 0x7C) >> 2;

		state.xOri = (data.getUint8(1) & 0x03) << 11 | (data.getUint8(2) & 0xFF) << 3 | (data.getUint8(3) & 0x80) >> 5;
		state.xOri = (state.xOri << 19) >> 19;

		state.yOri = (data.getUint8(3) & 0x1F) << 8 | (data.getUint8(4) & 0xFF);
		state.yOri = (state.yOri << 19) >> 19;

		state.zOri = (data.getUint8(5) & 0xFF) << 5 | (data.getUint8(6) & 0xF8) >> 3;
		state.zOri = (state.zOri << 19) >> 19;

		state.xAcc = (data.getUint8(6) & 0x07) << 10 | (data.getUint8(7) & 0xFF) << 2 | (data.getUint8(8) & 0xC0) >> 6;
		state.xAcc = (state.xAcc << 19) >> 19;

		state.yAcc = (data.getUint8(8) & 0x3F) << 7 | (data.getUint8(9) & 0xFE) >>> 1;
		state.yAcc = (state.yAcc << 19) >> 19;

		state.zAcc = (data.getUint8(9) & 0x01) << 12 | (data.getUint8(10) & 0xFF) << 4 | (data.getUint8(11) & 0xF0) >> 4;
		state.zAcc = (state.zAcc << 19) >> 19;

		state.xGyro = ((data.getUint8(11) & 0x0F) << 9 | (data.getUint8(12) & 0xFF) << 1 | (data.getUint8(13) & 0x80) >> 7);
		state.xGyro = (state.xGyro << 19) >> 19;

		state.yGyro = ((data.getUint8(13) & 0x7F) << 6 | (data.getUint8(14) & 0xFC) >> 2);
		state.yGyro = (state.yGyro << 19) >> 19;

		state.zGyro = ((data.getUint8(14) & 0x03) << 11 | (data.getUint8(15) & 0xFF) << 3 | (data.getUint8(16) & 0xE0) >> 5);
		state.zGyro = (state.zGyro << 19) >> 19;

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
