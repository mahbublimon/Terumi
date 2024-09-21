const SupportMember = require('../models/SupportMember');

module.exports = {
  /**
   * Auto-assign a support staff to a ticket.
   * @returns {Promise<SupportMember>} Returns a support member who is available.
   */
  async assignSupport() {
    // Find support members who are available and have the least number of tickets assigned
    const supportStaff = await SupportMember.find({ isAvailable: true })
      .sort({ ticketsAssigned: 1 })   // Sort by least assigned tickets
      .limit(1);                      // Get the most available staff member

    if (!supportStaff || supportStaff.length === 0) {
      throw new Error('No available support staff.');
    }

    // Mark the support member as no longer available (optional)
    const assignedSupport = supportStaff[0];
    assignedSupport.ticketsAssigned += 1;
    await assignedSupport.save();

    return assignedSupport;
  },

  /**
   * Mark a support member as available when a ticket is closed.
   * @param {String} supportID - The ID of the support staff member.
   */
  async releaseSupport(supportID) {
    const supportMember = await SupportMember.findOne({ userID: supportID });

    if (supportMember) {
      supportMember.isAvailable = true;
      supportMember.ticketsAssigned = Math.max(0, supportMember.ticketsAssigned - 1); // Ensure no negative assignments
      await supportMember.save();
    }
  },
};
