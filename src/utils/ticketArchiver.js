const TicketTranscript = require('../models/TicketTranscript');
const { encrypt } = require('./transcriptEncryption');

/**
 * Archives a ticket by saving its transcript to the database.
 * @param {String} ticketID - The ID of the ticket being archived.
 * @param {Array} messages - An array of messages from the ticket.
 */
async function archiveTicket(ticketID, messages) {
  // Serialize the messages into a string format (you can also include attachments)
  const transcript = messages.map(msg => `${msg.author.tag}: ${msg.content}`).join('\n');

  // Encrypt the transcript before saving
  const encryptedTranscript = encrypt(transcript);

  // Save the transcript in the database
  const ticketTranscript = new TicketTranscript({
    ticketID: ticketID,
    transcript: encryptedTranscript,
  });

  await ticketTranscript.save();
}

module.exports = { archiveTicket };
