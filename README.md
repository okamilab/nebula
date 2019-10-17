[![CircleCI](https://circleci.com/gh/okamilab/nebula/tree/master.svg?style=svg)](https://circleci.com/gh/okamilab/nebula/tree/master)

# Nebula
Messenger dapp based on PSS protocol over swarm.

The project works with local instanse of swarm, default endpoint `ws://127.0.0.1:8546`

# Try it
You can run the dapp http://nebuladapp.net. In order to run swarm take a look [#Running nebula](https://github.com/okamilab/nebula#running-nebula) section.

**NOTE:** You need to force insecure connection (`http://`) in order to connect to swarm WebSocket (`ws://`). It is not possible to connect to secure WebSocket at the moment.

# Playground
In order to play with Nebula you can use predefined nodes:
* http://nebuladapp.net/?pss=ws://77.120.119.9:8547
* http://nebuladapp.net/?pss=ws://77.120.119.9:8548

# Roadmap
* Improvements
	* [x] Restore connection after lose [#21](https://github.com/okamilab/nebula/issues/21)
	* [x] Copy-full-key-hex--to-clipboard for publicKeys [#20](https://github.com/okamilab/nebula/issues/20)
	* [x] Fix messages order in chat [#22](https://github.com/okamilab/nebula/issues/22)
	
* Routing
	* [x] Avoid broadcasting, reveal address partially

* File sharing
	* [ ] Data encryption
	
* State management
	* [ ] Save/restore state to/from swarm
	* [ ] Data encryption
	* [ ] Auto/manual state backup

* UX improvements
	* [ ] Design
		* [x] Material-UI
	* Contact management
		* [ ] Add posibility to change contact usename
		* [ ] Manage of declined contacts
	* Chat management
		* [ ] Add posibility to set chat name
		* [ ] Add posibility to check chat info (participants, stat)
		* [ ] Add posibility to leave chat
		* [ ] Optimize chat representation (render last X messages, the rest - on demand)
		* [ ] Highlighting unread messages
		* [ ] Archive chat
		* [ ] Images preview
		* [ ] Smiles
	* Notification
		* [ ] Contact mutations (received request, added or declined request events)
		* [ ] Chat mutations (received message, contact left events)
		* [x] DApp events (connection lost, etc.)
		
* ENS
	* [ ] Investigate possibility of ENS integration, using ENS for contacts and onw PSS address
	* [ ] Experiment with ENS by extending the protocol for using PSS addresses
	
* Research
	* [ ] Investigate swarm execution options, is it possible to run without unlock an account. In order to provide one swarm instance for multiple accounts
	* [ ] Investigate possibility to create multi users chats
	* [ ] Investigate payments initiated from chat
	* [ ] Investigate possibility to run the dapp on mobile
	* [ ] Investigate possibility to run the dapp as a browser extension
	
* Feeds
	* [ ] Investigate feeds
	* [ ] Experiment with feeds, store personal data in swarm

* Non-functional
	* [ ] Unit/integration testing
	* [x] Linting
	* [ ] Investigate how to deploy the dapp properly
	* [ ] Continuous deployment

* Hosting
	* [x] Buy ENS name
	* [x] Buy domain name
	* [ ] Proxy from domain name to ENS (?)

## Introduction
[![Nebula intro](https://img.youtube.com/vi/RKPL8Njbu84/0.jpg)](https://www.youtube.com/watch?v=RKPL8Njbu84)

## Updates
1. [Nebula Ðapp](https://medium.com/okami-lab/nebula-%C3%B0app-870dc7602deb)
2. [Nebula Ðapp Development Update #1](https://medium.com/okami-lab/nebula-%C3%B0app-development-update-1-ad4182978013)

## Building the source
Make sure you have installed the necessary dependencies using `npm`:

```sh
$ npm i
```

To build a production version of the web application, run the following,
command in your command prompt:

```sh
$ npm run build
```

This will build both the server and client bundle in the `build/`
directory.

## Running nebula
1. First important step is to [run swarm](https://swarm-guide.readthedocs.io/en/latest/gettingstarted.html)

	The command may look like:
	```sh
	swarm --bzzaccount <address> --ws --wsorigins "*" --corsdomain "*"
	```
	The commands enable the WS-RPC server `--ws`, allows any origins from which to accept websockets requests `--wsorigins "*"` and allows any domains from which to accept http requests `--corsdomain "*"`
	
	ATTENTION: the command is not secure, it is suitable only for testing purpose. Otherwise, you need to restrict origins

	By default, WS-RPC runs at `ws://127.0.0.1:8546`, nebula will connect with this endpoint, otherwise you need to change settings in nebula dapp.

2. To run the development version of the web application, run the following
command in your command prompt:

	```sh
	$ npm start
	```
	or, the production server that serves the web
application can be launched using:

	```sh
	$ node build/index.js
	```

	This will host the web application at http://localhost:3000. The host
and port can be customized using respectively the environmental variables
`HOST` and `PORT`. Any changes made on the code base are detected and
will hot reload changed parts of the application.

## References
1. https://swarm.ethereum.org
2. https://swarm-guide.readthedocs.io/en/latest