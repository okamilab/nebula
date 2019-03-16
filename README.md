# Swarm Messenger
Messenger based on PSS protocol.

The project works with local instanse of swarm, port `8546`

Endpoint `ws://127.0.0.1:8546`

# Roadmap
* Improvements
	* [ ] Restore connection after lose [#21](https://github.com/aquiladev/swarm-messenger/issues/21)
	* [ ] Copy-full-key-hex--to-clipboard for publicKeys [#20](https://github.com/aquiladev/swarm-messenger/issues/20)
	* [x] Fix messages order in chat [#22](https://github.com/aquiladev/swarm-messenger/issues/22)
	
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
		* [ ] DApp events (connection lost, etc.)
		
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
	* [ ] Linting
	* [ ] Investigate how to deploy the dapp properly
	* [ ] Continuous deployment

* Hosting
	* [x] Buy ENS name
	* [ ] Buy domain name (?)
	* [ ] Proxy from domain name to ENS (?)

## Getting Started
### Setting up
Make sure you have installed the necessary dependencies using `yarn`:

```sh
$ yarn
```

### Running
To run the development version of the web application, run the following
command in your command prompt:

```sh
$ npm start
```

This will host the web application at http://localhost:3000. The host
and port can be customized using respectively the environmental variables
`HOST` and `PORT`. Any changes made on the code base are detected and
will hot reload changed parts of the application.

### Building
To build a production version of the web application, run the following,
command in your command prompt:

```sh
$ npm run build
```

This will build both the server and client bundle in the `build/`
directory. After building, the production server that serves the web
application can be launched using:

```sh
$ node build/index.js
```

This will host the web application at http://localhost:3000. The host
and port can be customized using respectively the environmental variables
`HOST` and `PORT`. Any changes made on the code base are detected and
will hot reload changed parts of the application.

### Deployment
To deploy the project, build it and deploy `build/` directory.
