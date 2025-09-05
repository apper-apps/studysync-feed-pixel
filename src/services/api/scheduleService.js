import schedulesData from "@/services/mockData/schedules.json";

class ScheduleService {
  constructor() {
    this.schedules = [...schedulesData];
  }

  async getAll() {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.schedules];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const schedule = this.schedules.find(s => s.Id === parseInt(id));
    return schedule ? { ...schedule } : null;
  }

  async create(scheduleData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const highestId = Math.max(...this.schedules.map(s => s.Id), 0);
    const newSchedule = {
      Id: highestId + 1,
      ...scheduleData
    };
    this.schedules.push(newSchedule);
    return { ...newSchedule };
  }

  async update(id, scheduleData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = this.schedules.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Schedule not found");
    }
    this.schedules[index] = { ...this.schedules[index], ...scheduleData };
    return { ...this.schedules[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = this.schedules.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Schedule not found");
    }
    this.schedules.splice(index, 1);
    return true;
  }

  async getByCourse(courseId) {
    await new Promise(resolve => setTimeout(resolve, 250));
    return this.schedules.filter(schedule => 
      schedule.courseId.toString() === courseId.toString()
    );
  }

  async getByDay(dayOfWeek) {
    await new Promise(resolve => setTimeout(resolve, 250));
    return this.schedules.filter(schedule => 
      schedule.dayOfWeek.toLowerCase() === dayOfWeek.toLowerCase()
    );
  }

  async getTodaysSchedule() {
    await new Promise(resolve => setTimeout(resolve, 250));
    const today = new Date();
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const todayName = days[today.getDay()];
    
    return this.schedules.filter(schedule => 
      schedule.dayOfWeek.toLowerCase() === todayName
    ).sort((a, b) => {
      const aTime = parseInt(a.startTime.replace(":", ""));
      const bTime = parseInt(b.startTime.replace(":", ""));
      return aTime - bTime;
    });
  }
}

export const scheduleService = new ScheduleService();