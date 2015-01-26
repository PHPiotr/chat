(function () {
	var getNode = function (s) {
		return document.querySelector(s);
	};
	var status = getNode('.chat-status span');
	var textarea = getNode('.chat textarea');
	var messages = getNode('.chat-messages');
	var chatName = getNode('.chat-name');
	var statusDefault = status.textContent;
	var socket = null;
	var setStatus = function (s) {
		status.textContent = s;
		if (s !== statusDefault) {
			var delay = setTimeout(function () {
				setStatus(statusDefault);
				clearInterval(delay);
			}, 3000);
		}
	};
	try {
		socket = io.connect('127.0.0.1:8080');
	} catch (e) {
		console.log(e.message);
	}
	if (socket !== undefined) {

		socket.on('output', function (data) {

			if (data.length) {

				// loop through results
				for (var x = 0; x < data.length; x += 1) {

					var message = document.createElement('div');
					message.setAttribute('class', 'chat-message');
					message.textContent = data[x].name + ': ' + data[x].message;

					// append
					messages.appendChild(message);
					messages.insertBefore(message, messages.firstChild);
				}
			}
		});

		// listen for a status
		socket.on('status', function (data) {
			setStatus(typeof data === 'object' ? data.message : data);
			if (data.clear) {
				textarea.value = '';
			}
		});

		// listen for keydown
		textarea.addEventListener('keydown', function (event) {

			var self = this;
			var name = chatName.value;

			if (event.which === 13 && !event.shiftKey) {

				socket.emit('input', {
					name: name,
					message: self.value
				});
				event.preventDefault();
			}
		});
	}
})();