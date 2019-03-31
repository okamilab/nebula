import { Subject, Observable, interval } from 'rxjs';
import { WebSocketSubject } from 'rxjs/webSocket';
import { distinctUntilChanged, share, takeWhile } from 'rxjs/operators';

/// we inherit from the ordinary Subject
export default class RxWebSocketSubject extends Subject {
  constructor(
    url,
    reconnectInterval = 5000, /// pause between connection
    resultSelector,
    serializer) {

    super();
    this.url = url;
    this.reconnectInterval = reconnectInterval;
    this.resultSelector = resultSelector;
    this.serializer = serializer;

    /// by default, when a message is received from the server, we are trying to decode it as JSON
    /// we can override it in the constructor
    this.defaultResultSelector = (e) => {
      return JSON.parse(e.data);
    };

    /// when sending a message, we encode it to JSON
    /// we can override it in the constructor
    this.defaultSerializer = (data) => {
      return JSON.stringify(data);
    };

    /// connection status
    this.connectionStatus = new Observable((observer) => {
      this.connectionObserver = observer;
    }).pipe(share())
      .pipe(distinctUntilChanged());

    if (!resultSelector) {
      this.resultSelector = this.defaultResultSelector;
    }

    if (!this.serializer) {
      this.serializer = this.defaultSerializer;
    }

    /// config for WebSocketSubject
    /// except the url, here is closeObserver and openObserver to update connection status
    this.wsSubjectConfig = {
      url: url,
      closeObserver: {
        next: (e) => {
          this.socket = null;
          this.connectionObserver.next(false);
        }
      },
      openObserver: {
        next: (e) => {
          this.connectionObserver.next(true);
        }
      }
    };

    /// we connect
    this.connect();

    /// we follow the connection status and run the reconnect while losing the connection
    this.connectionStatus.subscribe((isConnected) => {
      if (!this.reconnectionObservable && typeof (isConnected) == "boolean" && !isConnected) {
        this.reconnect();
      }
    });
  }

  connect() {
    this.socket = new WebSocketSubject(this.wsSubjectConfig);
    this.socket.subscribe((m) => {
      this.next(m); /// when receiving a message, we just send it to our Subject
    }, (_) => {
      if (!this.socket) {
        /// in case of an error with a loss of connection, we restore it
        this.reconnect();
      }
    });
  }

  /// WebSocket Reconnect handling
  reconnect() {
    this.reconnectionObservable = interval(this.reconnectInterval)
      .pipe(takeWhile(() => {
        return !this.socket;
      }));

    this.reconnectionObservable.subscribe(() => {
      this.connect();
    }, null, () => {
      /// if the reconnection attempts are failed, then we call complete of our Subject and status
      this.reconnectionObservable = null;
      if (!this.socket) {
        this.complete();
        this.connectionObserver.complete();
      }
    });
  }

  /// sending the message
  send(data) {
    this.socket.next(this.serializer(data));
  }
}
