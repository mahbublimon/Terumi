export const name = 'ready';
export const once = true;

export function execute(client) {
    console.log(`${client.user.tag} is ready and online!`);
}
