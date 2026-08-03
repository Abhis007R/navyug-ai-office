import { employees } from "./employees/employee.registry";
import { taskQueue } from "./queue/task.queue";
import { workflowEngine } from "./workflows/workflow.engine";

export class AIOrchestrator {
  startOffice() {
    console.log("=================================");
    console.log("🚀 Navyug AI Office Started");
    console.log("=================================");

    // Initialize all employees
    employees.forEach((employee) => {
      console.log(`✅ ${employee.name} is ${employee.status}`);
    });

    console.log(`👥 Total AI Employees: ${employees.length}`);
  }

  showQueues() {
    console.log("📋 Current Task Queue");
    console.table(taskQueue.getTasks());
  }

  startDonorWorkflow(donor: any) {
    workflowEngine.startDonorWorkflow(donor);
  }

  proposalApproved(proposal: any) {
    workflowEngine.approveProposal(proposal);
  }

  donationReceived(donation: any) {
    workflowEngine.donationReceived(donation);
  }
}

export const orchestrator = new AIOrchestrator();