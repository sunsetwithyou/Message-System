import { sendGroupMessage } from "./services/sendGroupMessage";
import { sendChannelMessage } from "./services/sendChannelMessage";

const args = process.argv.slice(2);
const type = args[0];
const message = args[1];

async function main() {
    if (!type || !message) {
        console.error("Usage: tsx src/index.ts [group|channel] [message]");
        return;
    }

    if (type === "group") {
        await sendGroupMessage(process.env.CHAT_ID!, message);
        console.log("Group message sent successfully!");
    } else if (type === "channel") {
        await sendChannelMessage(process.env.TEAM_ID!, process.env.CHANNEL_ID!, message);
        console.log("Channel message sent successfully!");
    } else {
        console.error("Invalid type. Use 'group' or 'channel'.");
    }
}

main().catch(console.error);