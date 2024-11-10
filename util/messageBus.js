'use strict'

	// 32768 was the max array size in IE7
	const INDEX_THRESHOLD = 32767;

	let topics;
	let index;
	let messageBus;

	//     messageBus.publish(messages.gameStarted);
	class InternalMessageBus {
		constructor() {
			topics = {};
			index = 0;
		}

		/**
		* Registers a callback to be called when a message is published to a topic
		* @param topic
		* @param callback
		* @returns {{unsubscribe: unsubscribe}} An object with an unsubscribe function.  There may be memory leaks if a subscription is not unsubscribed.
		*/
		subscribe(topic, callback, target = null) {
			if(!topic) {
				console.error("Undefined subscription topic for callback: ");
				console.error(callback);
				return;
			}
			if (typeof callback !== 'function') {
				console.error("Topic "+topic+" encountered error with callback: ");
				console.log(callback);
				throw 'callback must be a function';
			}

			if (!topics.hasOwnProperty(topic)) {
				topics[topic] = {};
			}

			let indexId = index.toString();

			// callbacks are saved in unique index keys
			// We don't use arrays because if you unsubscribe,
			// then the array indices will be reordered after deletion
			topics[topic][indexId] = {
				callback: callback,
				target: target
			};
			index++;
			if (index > INDEX_THRESHOLD) {
				// waaaaay too many subscribers for this topic!
				console.warn(`WARNING: Subscriber threshold reached for topic ${topic}!`);
			}

			return {
				unsubscribe: function() {
					delete topics[topic][indexId];
				},
				topic: topic
			}
		}

		/**
		* Publish a message to a topic
		* @param topic
		* @param message object that will be passed to the callbacks
		*/
		publish(topic, message = null) {
			let errors = [];
			if (topics.hasOwnProperty(topic)) {
				let callbacks = topics[topic];
				let args = [];
				// arguments is sometimes not a traditional javascript array so we can't slide/clone
				for (let i = 1; i < arguments.length; i++) {
					args.push(arguments[i]);
				}
				for (let key in callbacks) {
					try {
						let obj = callbacks[key];
						obj.callback.apply(obj.target, args);
					} catch (error) {
						errors.push(error);
					}
				}

				if (errors.length > 0) {
					for (let i = 0; i < errors.length; i++) {
						console.error(errors[i]);
					}
				}
			}
		}
	}

	messageBus = new InternalMessageBus();

