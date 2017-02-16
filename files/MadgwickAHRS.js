/**
 * @author mrdoob / http://mrdoob.com/
 */

function MadgwickAHRS() {

	//=====================================================================================================
	// MadgwickAHRS.c
	//=====================================================================================================
	//
	// Implementation of Madgwick's IMU and AHRS algorithms.
	// See: http://www.x-io.co.uk/node/8#open_source_ahrs_and_imu_algorithms
	//
	// Date         Author          Notes
	// 29/09/2011   SOH Madgwick    Initial release
	// 02/10/2011   SOH Madgwick    Optimised for reduced CPU load
	// 19/02/2012   SOH Madgwick    Magnetometer measurement is normalised
	//
	//=====================================================================================================

	"use strict";

	//---------------------------------------------------------------------------------------------------
	// Definitions

	var sampleFreq = 100.0;  // sample frequency in Hz
	var betaDef    =  1;   // 2 * proportional gain

	//---------------------------------------------------------------------------------------------------
	// Variable definitions

	var beta = betaDef;                         // 2 * proportional gain (Kp)
	var q0 = 1.0, q1 = 0.0, q2 = 0.0, q3 = 0.0; // quaternion of sensor frame relative to auxiliary frame

	//====================================================================================================
	// Functions

	//---------------------------------------------------------------------------------------------------
	// IMU algorithm update
	function madgwickAHRSupdateIMU(gx, gy, gz, ax, ay, az) {
			var recipNorm;
			var s0, s1, s2, s3;
			var qDot1, qDot2, qDot3, qDot4;
			var V_2q0, V_2q1, V_2q2, V_2q3, V_4q0, V_4q1, V_4q2, V_8q1, V_8q2, q0q0, q1q1, q2q2, q3q3;

			// Rate of change of quaternion from gyroscope
			qDot1 = 0.5 * (-q1 * gx - q2 * gy - q3 * gz);
			qDot2 = 0.5 * (q0 * gx + q2 * gz - q3 * gy);
			qDot3 = 0.5 * (q0 * gy - q1 * gz + q3 * gx);
			qDot4 = 0.5 * (q0 * gz + q1 * gy - q2 * gx);

			// Compute feedback only if accelerometer measurement valid (avoids NaN in accelerometer normalisation)
			if (!((ax === 0.0) && (ay === 0.0) && (az === 0.0))) {

					// Normalise accelerometer measurement
					recipNorm = Math.pow(ax * ax + ay * ay + az * az, -0.5);
					ax *= recipNorm;
					ay *= recipNorm;
					az *= recipNorm;

					// Auxiliary variables to avoid repeated arithmetic
					V_2q0 = 2.0 * q0;
					V_2q1 = 2.0 * q1;
					V_2q2 = 2.0 * q2;
					V_2q3 = 2.0 * q3;
					V_4q0 = 4.0 * q0;
					V_4q1 = 4.0 * q1;
					V_4q2 = 4.0 * q2;
					V_8q1 = 8.0 * q1;
					V_8q2 = 8.0 * q2;
					q0q0 = q0 * q0;
					q1q1 = q1 * q1;
					q2q2 = q2 * q2;
					q3q3 = q3 * q3;

					// Gradient decent algorithm corrective step
					s0 = V_4q0 * q2q2 + V_2q2 * ax + V_4q0 * q1q1 - V_2q1 * ay;
					s1 = V_4q1 * q3q3 - V_2q3 * ax + 4.0 * q0q0 * q1 - V_2q0 * ay - V_4q1 + V_8q1 * q1q1 + V_8q1 * q2q2 + V_4q1 * az;
					s2 = 4.0 * q0q0 * q2 + V_2q0 * ax + V_4q2 * q3q3 - V_2q3 * ay - V_4q2 + V_8q2 * q1q1 + V_8q2 * q2q2 + V_4q2 * az;
					s3 = 4.0 * q1q1 * q3 - V_2q1 * ax + 4.0 * q2q2 * q3 - V_2q2 * ay;
					recipNorm = Math.pow(s0 * s0 + s1 * s1 + s2 * s2 + s3 * s3, -0.5); // normalise step magnitude
					s0 *= recipNorm;
					s1 *= recipNorm;
					s2 *= recipNorm;
					s3 *= recipNorm;

					// Apply feedback step
					qDot1 -= beta * s0;
					qDot2 -= beta * s1;
					qDot3 -= beta * s2;
					qDot4 -= beta * s3;
			}

			// Integrate rate of change of quaternion to yield quaternion
			q0 += qDot1 * (1.0 / sampleFreq);
			q1 += qDot2 * (1.0 / sampleFreq);
			q2 += qDot3 * (1.0 / sampleFreq);
			q3 += qDot4 * (1.0 / sampleFreq);

			// Normalise quaternion
			recipNorm = Math.pow(q0 * q0 + q1 * q1 + q2 * q2 + q3 * q3, -0.5);
			q0 *= recipNorm;
			q1 *= recipNorm;
			q2 *= recipNorm;
			q3 *= recipNorm;
	}

	//---------------------------------------------------------------------------------------------------
	// AHRS algorithm update

	function madgwickAHRSupdate(gx, gy, gz, ax, ay, az, mx, my, mz) {
			var recipNorm;
			var s0, s1, s2, s3;
			var qDot1, qDot2, qDot3, qDot4;
			var hx, hy;
			var V_2q0mx, V_2q0my, V_2q0mz, V_2q1mx, V_2bx, V_2bz, V_4bx, V_4bz, V_2q0, V_2q1, V_2q2, V_2q3, V_2q0q2, V_2q2q3;
			var q0q0, q0q1, q0q2, q0q3, q1q1, q1q2, q1q3, q2q2, q2q3, q3q3;

			// Use IMU algorithm if magnetometer measurement invalid (avoids NaN in magnetometer normalisation)
			if ((mx === 0.0) && (my === 0.0) && (mz === 0.0)) {
					madgwickAHRSupdateIMU(gx, gy, gz, ax, ay, az);
					return;
			}

			// Rate of change of quaternion from gyroscope
			qDot1 = 0.5 * (-q1 * gx - q2 * gy - q3 * gz);
			qDot2 = 0.5 * (q0 * gx + q2 * gz - q3 * gy);
			qDot3 = 0.5 * (q0 * gy - q1 * gz + q3 * gx);
			qDot4 = 0.5 * (q0 * gz + q1 * gy - q2 * gx);

			// Compute feedback only if accelerometer measurement valid (avoids NaN in accelerometer normalisation)
			if (!((ax === 0.0) && (ay === 0.0) && (az === 0.0))) {

					// Normalise accelerometer measurement
					recipNorm = Math.pow(ax * ax + ay * ay + az * az,  -0.5);
					ax *= recipNorm;
					ay *= recipNorm;
					az *= recipNorm;

					// Normalise magnetometer measurement
					recipNorm = Math.pow(mx * mx + my * my + mz * mz, -0.5);
					mx *= recipNorm;
					my *= recipNorm;
					mz *= recipNorm;

					// Auxiliary variables to avoid repeated arithmetic
					V_2q0mx = 2.0 * q0 * mx;
					V_2q0my = 2.0 * q0 * my;
					V_2q0mz = 2.0 * q0 * mz;
					V_2q1mx = 2.0 * q1 * mx;
					V_2q0 = 2.0 * q0;
					V_2q1 = 2.0 * q1;
					V_2q2 = 2.0 * q2;
					V_2q3 = 2.0 * q3;
					V_2q0q2 = 2.0 * q0 * q2;
					V_2q2q3 = 2.0 * q2 * q3;
					q0q0 = q0 * q0;
					q0q1 = q0 * q1;
					q0q2 = q0 * q2;
					q0q3 = q0 * q3;
					q1q1 = q1 * q1;
					q1q2 = q1 * q2;
					q1q3 = q1 * q3;
					q2q2 = q2 * q2;
					q2q3 = q2 * q3;
					q3q3 = q3 * q3;

					// Reference direction of Earth's magnetic field
					hx = mx * q0q0 - V_2q0my * q3 + V_2q0mz * q2 + mx * q1q1 + V_2q1 * my * q2 + V_2q1 * mz * q3 - mx * q2q2 - mx * q3q3;
					hy = V_2q0mx * q3 + my * q0q0 - V_2q0mz * q1 + V_2q1mx * q2 - my * q1q1 + my * q2q2 + V_2q2 * mz * q3 - my * q3q3;
					V_2bx = Math.sqrt(hx * hx + hy * hy);
					V_2bz = -V_2q0mx * q2 + V_2q0my * q1 + mz * q0q0 + V_2q1mx * q3 - mz * q1q1 + V_2q2 * my * q3 - mz * q2q2 + mz * q3q3;
					V_4bx = 2.0 * V_2bx;
					V_4bz = 2.0 * V_2bz;

					// Gradient decent algorithm corrective step
					s0 = -V_2q2 * (2.0 * q1q3 - V_2q0q2 - ax) + V_2q1 * (2.0 * q0q1 + V_2q2q3 - ay) - V_2bz * q2 * (V_2bx * (0.5 - q2q2 - q3q3) + V_2bz * (q1q3 - q0q2) - mx) + (-V_2bx * q3 + V_2bz * q1) * (V_2bx * (q1q2 - q0q3) + V_2bz * (q0q1 + q2q3) - my) + V_2bx * q2 * (V_2bx * (q0q2 + q1q3) + V_2bz * (0.5 - q1q1 - q2q2) - mz);
					s1 = V_2q3 * (2.0 * q1q3 - V_2q0q2 - ax) + V_2q0 * (2.0 * q0q1 + V_2q2q3 - ay) - 4.0 * q1 * (1 - 2.0 * q1q1 - 2.0 * q2q2 - az) + V_2bz * q3 * (V_2bx * (0.5 - q2q2 - q3q3) + V_2bz * (q1q3 - q0q2) - mx) + (V_2bx * q2 + V_2bz * q0) * (V_2bx * (q1q2 - q0q3) + V_2bz * (q0q1 + q2q3) - my) + (V_2bx * q3 - V_4bz * q1) * (V_2bx * (q0q2 + q1q3) + V_2bz * (0.5 - q1q1 - q2q2) - mz);
					s2 = -V_2q0 * (2.0 * q1q3 - V_2q0q2 - ax) + V_2q3 * (2.0 * q0q1 + V_2q2q3 - ay) - 4.0 * q2 * (1 - 2.0 * q1q1 - 2.0 * q2q2 - az) + (-V_4bx * q2 - V_2bz * q0) * (V_2bx * (0.5 - q2q2 - q3q3) + V_2bz * (q1q3 - q0q2) - mx) + (V_2bx * q1 + V_2bz * q3) * (V_2bx * (q1q2 - q0q3) + V_2bz * (q0q1 + q2q3) - my) + (V_2bx * q0 - V_4bz * q2) * (V_2bx * (q0q2 + q1q3) + V_2bz * (0.5 - q1q1 - q2q2) - mz);
					s3 = V_2q1 * (2.0 * q1q3 - V_2q0q2 - ax) + V_2q2 * (2.0 * q0q1 + V_2q2q3 - ay) + (-V_4bx * q3 + V_2bz * q1) * (V_2bx * (0.5 - q2q2 - q3q3) + V_2bz * (q1q3 - q0q2) - mx) + (-V_2bx * q0 + V_2bz * q2) * (V_2bx * (q1q2 - q0q3) + V_2bz * (q0q1 + q2q3) - my) + V_2bx * q1 * (V_2bx * (q0q2 + q1q3) + V_2bz * (0.5 - q1q1 - q2q2) - mz);
					recipNorm = Math.pow(s0 * s0 + s1 * s1 + s2 * s2 + s3 * s3, -0.5); // normalise step magnitude
					s0 *= recipNorm;
					s1 *= recipNorm;
					s2 *= recipNorm;
					s3 *= recipNorm;

					// Apply feedback step
					qDot1 -= beta * s0;
					qDot2 -= beta * s1;
					qDot3 -= beta * s2;
					qDot4 -= beta * s3;
			}

			// Integrate rate of change of quaternion to yield quaternion
			q0 += qDot1 * (1.0 / sampleFreq);
			q1 += qDot2 * (1.0 / sampleFreq);
			q2 += qDot3 * (1.0 / sampleFreq);
			q3 += qDot4 * (1.0 / sampleFreq);

			// Normalise quaternion
			recipNorm = Math.pow(q0 * q0 + q1 * q1 + q2 * q2 + q3 * q3, -0.5);
			q0 *= recipNorm;
			q1 *= recipNorm;
			q2 *= recipNorm;
			q3 *= recipNorm;
	}

	return {

		getQuaternion: function () {

			// https://github.com/ZiCog/madgwick.js/blob/master/scene.js#L339

			return [ q1, q2, q3, q0 ];

		},

		setQuaternion: function ( array ) {

			q1 = array[ 0 ];
			q2 = array[ 1 ];
			q3 = array[ 2 ];
			q0 = array[ 3 ];

		},

		update: madgwickAHRSupdate,

	}

}
