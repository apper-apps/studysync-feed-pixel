import { toast } from 'react-toastify';

class ScheduleService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'schedule_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "course_id_c" } },
          { field: { Name: "day_of_week_c" } },
          { field: { Name: "start_time_c" } },
          { field: { Name: "end_time_c" } },
          { field: { Name: "location_c" } }
        ]
      };
      
      const response = await this.client.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching schedules:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "course_id_c" } },
          { field: { Name: "day_of_week_c" } },
          { field: { Name: "start_time_c" } },
          { field: { Name: "end_time_c" } },
          { field: { Name: "location_c" } }
        ]
      };
      
      const response = await this.client.getRecordById(this.tableName, id, params);
      
      if (!response || !response.data) {
        return null;
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching schedule with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }

  async create(scheduleData) {
    try {
      const params = {
        records: [{
          Name: `${scheduleData.dayOfWeek || scheduleData.day_of_week_c} Schedule`,
          course_id_c: scheduleData.courseId ? scheduleData.courseId.toString() : (scheduleData.course_id_c ? scheduleData.course_id_c.toString() : ""),
          day_of_week_c: scheduleData.dayOfWeek || scheduleData.day_of_week_c,
          start_time_c: scheduleData.startTime || scheduleData.start_time_c,
          end_time_c: scheduleData.endTime || scheduleData.end_time_c,
          location_c: scheduleData.location || scheduleData.location_c || ""
        }]
      };
      
      const response = await this.client.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create schedule ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating schedule:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }

  async update(id, scheduleData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: scheduleData.Name || `${scheduleData.dayOfWeek || scheduleData.day_of_week_c} Schedule`,
          course_id_c: scheduleData.courseId ? scheduleData.courseId.toString() : (scheduleData.course_id_c ? scheduleData.course_id_c.toString() : undefined),
          day_of_week_c: scheduleData.dayOfWeek || scheduleData.day_of_week_c,
          start_time_c: scheduleData.startTime || scheduleData.start_time_c,
          end_time_c: scheduleData.endTime || scheduleData.end_time_c,
          location_c: scheduleData.location || scheduleData.location_c
        }]
      };
      
      const response = await this.client.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update schedule ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating schedule:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: Array.isArray(id) ? id : [id]
      };
      
      const response = await this.client.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete schedule ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        const recordIds = Array.isArray(id) ? id : [id];
        return successfulDeletions.length === recordIds.length;
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting schedule:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return false;
    }
  }

  async getByCourse(courseId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "course_id_c" } },
          { field: { Name: "day_of_week_c" } },
          { field: { Name: "start_time_c" } },
          { field: { Name: "end_time_c" } },
          { field: { Name: "location_c" } }
        ],
        where: [
          {
            FieldName: "course_id_c",
            Operator: "EqualTo",
            Values: [parseInt(courseId)]
          }
        ]
      };
      
      const response = await this.client.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching schedules by course:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  }

  async getByDay(dayOfWeek) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "course_id_c" } },
          { field: { Name: "day_of_week_c" } },
          { field: { Name: "start_time_c" } },
          { field: { Name: "end_time_c" } },
          { field: { Name: "location_c" } }
        ],
        where: [
          {
            FieldName: "day_of_week_c",
            Operator: "EqualTo",
            Values: [dayOfWeek.toLowerCase()]
          }
        ]
      };
      
      const response = await this.client.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching schedules by day:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  }

  async getTodaysSchedule() {
    try {
      const today = new Date();
      const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
      const todayName = days[today.getDay()];
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "course_id_c" } },
          { field: { Name: "day_of_week_c" } },
          { field: { Name: "start_time_c" } },
          { field: { Name: "end_time_c" } },
          { field: { Name: "location_c" } }
        ],
        where: [
          {
            FieldName: "day_of_week_c",
            Operator: "EqualTo",
            Values: [todayName]
          }
        ],
        orderBy: [
          {
            fieldName: "start_time_c",
            sorttype: "ASC"
          }
        ]
      };
      
      const response = await this.client.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching today's schedule:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  }
}

export const scheduleService = new ScheduleService();