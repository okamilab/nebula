import { registry as chatRegistry } from './chats';
export * from './contacts';

const registry = { ...chatRegistry };

function handleMessage(store, data) {
  if (!data && !data.type) {
    console.error('Nebula::Message is invalid');
    return;
  }

  if (!registry[data.type]) {
    console.error('Nebula::Handler not found');
    return;
  }

  return registry[data.type](store, data);
}

export function run(store) {
  window.addEventListener('message', function (event) {
    return handleMessage(store, event.data);
  }, false);

  console.log('Nebula::APIs started');
}