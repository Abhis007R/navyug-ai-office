import { eventBus } from "../events/event.bus";
import { taskQueue } from "../queue/task.queue";

export class WorkflowEngine {
  startDonorWorkflow(donor: any) {
    console.log("🚀 Starting Donor Workflow");

    // Step 1: Notify that donor was found
    eventBus.publish("DONOR_FOUND", donor);

    // Step 2: Create Grant Task
    taskQueue.addTask({
      id: crypto.randomUUID(),
      employeeId: "grant",
      title: `Create proposal for ${donor.name}`,
      payload: donor,
      status: "pending",
      createdAt: new Date(),
    });
  }

  approveProposal(proposal: any) {
    eventBus.publish("PROPOSAL_APPROVED", proposal);

    taskQueue.addTask({
      id: crypto.randomUUID(),
      employeeId: "seva",
      title: `Send proposal to ${proposal.organization}`,
      payload: proposal,
      status: "pending",
      createdAt: new Date(),
    });
  }

  donationReceived(donation: any) {
    eventBus.publish("DONATION_RECEIVED", donation);

    taskQueue.addTask({
      id: crypto.randomUUID(),
      employeeId: "lekha",
      title: "Generate Receipt",
      payload: donation,
      status: "pending",
      createdAt: new Date(),
    });

    taskQueue.addTask({
      id: crypto.randomUUID(),
      employeeId: "media",
      title: "Create Success Story",
      payload: donation,
      status: "pending",
      createdAt: new Date(),
    });
  }
}

export const workflowEngine = new WorkflowEngine();