import { map, filter } from 'rxjs/operators';
import { SwarmClient } from '@erebos/swarm-browser';

export default class Messanger {
  client = undefined
  account = {}

  constructor(config) {
    this.client = new SwarmClient({ ws: config.ws });

    return (async () => {
      this.account = await this.getAccount();

      if (config.onReceiveContactEvent) {
        const subscription = await this.createContactSubscription(this.account.publicKey);
        subscription.subscribe(config.onReceiveContactEvent);
      }

      return this;
    })();
  }

  async getAccount() {
    const [publicKey, overlayAddress] = await Promise.all([
      this.client.pss.getPublicKey(),
      this.client.pss.baseAddr(),
    ]);

    return { publicKey, overlayAddress };
  }

  createRandomString() {
    return Math.random()
      .toString(36)
      .slice(2);
  }

  async sendContactRequest(key, overlayAddress) {
    const [contactTopic, sharedTopic] = await Promise.all([
      this.client.pss.stringToTopic(key),
      this.client.pss.stringToTopic(this.createRandomString()),
    ]);

    await this.client.pss.setPeerPublicKey(key, contactTopic);
    const message = {
      type: 'contact_request',
      payload: {
        username: undefined,
        message: 'Hi there',
        topic: sharedTopic,
        overlay_address: overlayAddress,
      },
      utc_timestamp: Date.now()
    };
    await this.client.pss.sendAsym(key, contactTopic, message);

    return { contactTopic, sharedTopic };
  }

  decodePssEvent(data) {
    console.log(data);
    return {
      key: data.key,
      data: data.msg.toObject(),
    }
  }

  async createContactSubscription(publicKey) {
    const topic = await this.client.pss.stringToTopic(publicKey);
    const subscription = await this.client.pss.createTopicSubscription(topic);
    return subscription.pipe(
      map(this.decodePssEvent),
      filter((event) => {
        return (
          (event.data.type === 'contact_request' &&
            event.data.payload != null &&
            event.data.payload.topic != null) ||
          event.data.type === 'contact_response'
        )
      }),
      map(
        (event) => ({
          key: event.key,
          type: event.data.type,
          payload: event.data.payload,
        }),
      ),
    )
  }
}