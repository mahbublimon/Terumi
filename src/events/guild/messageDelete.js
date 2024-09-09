import { logMessageDelete } from "../../utils/logging.js";

export default {
  name: "messageDelete",
  async execute(message, client) {
    if (message.partial) await message.fetch();
    logMessageDelete(client, message);
  },
};
