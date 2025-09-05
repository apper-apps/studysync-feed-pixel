import assignmentsData from "@/services/mockData/assignments.json";

class AssignmentService {
  constructor() {
    this.assignments = [...assignmentsData];
  }

  async getAll() {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.assignments];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const assignment = this.assignments.find(a => a.Id === parseInt(id));
    return assignment ? { ...assignment } : null;
  }

  async create(assignmentData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const highestId = Math.max(...this.assignments.map(a => a.Id), 0);
    const newAssignment = {
      Id: highestId + 1,
      ...assignmentData,
      status: assignmentData.status || "todo",
      grade: assignmentData.grade || null
    };
    this.assignments.push(newAssignment);
    return { ...newAssignment };
  }

  async update(id, assignmentData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = this.assignments.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Assignment not found");
    }
    this.assignments[index] = { ...this.assignments[index], ...assignmentData };
    return { ...this.assignments[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = this.assignments.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Assignment not found");
    }
    this.assignments.splice(index, 1);
    return true;
  }

  async getByCourse(courseId) {
    await new Promise(resolve => setTimeout(resolve, 250));
    return this.assignments.filter(assignment => 
      assignment.courseId.toString() === courseId.toString()
    );
  }

  async getByStatus(status) {
    await new Promise(resolve => setTimeout(resolve, 250));
    return this.assignments.filter(assignment => assignment.status === status);
  }

  async getUpcoming(days = 7) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const today = new Date();
    const futureDate = new Date(today.getTime() + (days * 24 * 60 * 60 * 1000));
    
    return this.assignments.filter(assignment => {
      const dueDate = new Date(assignment.dueDate);
      return dueDate >= today && dueDate <= futureDate && assignment.status === "todo";
    }).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }

  async toggleComplete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = this.assignments.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Assignment not found");
    }
    
    const currentStatus = this.assignments[index].status;
    this.assignments[index].status = currentStatus === "completed" ? "todo" : "completed";
    
    return { ...this.assignments[index] };
  }
}

export const assignmentService = new AssignmentService();