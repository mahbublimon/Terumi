const SupportMember = require('../models/SupportMember');

module.exports = {
  async assignSupport() {
    const supportStaff = await SupportMember.find({ isAvailable: true })
      .sort({ ticketsAssigned: 1 })
      .limit(1);

    if (!supportStaff || supportStaff.length === 0) {
      throw new Error('No available support staff.');
    }

    const assignedSupport = supportStaff[0];
    assignedSupport.isAvailable = false;
    assignedSupport.ticketsAssigned += 1;
    await assignedSupport.save();

    return assignedSupport;
  },

  async releaseSupport(supportID) {
    const supportMember = await SupportMember.findOne({ userID: supportID });

    if (supportMember) {
      supportMember.isAvailable = true;
      supportMember.ticketsAssigned = Math.max(0, supportMember.ticketsAssigned - 1);
      await supportMember.save();
    }
  },
};
