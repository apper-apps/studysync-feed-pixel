import { toast } from 'react-toastify';

class AssignmentService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'assignment_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "course_id_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "grade_c" } }
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
        console.error("Error fetching assignments:", error?.response?.data?.message);
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
          { field: { Name: "title_c" } },
          { field: { Name: "course_id_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "grade_c" } }
        ]
      };
      
      const response = await this.client.getRecordById(this.tableName, id, params);
      
      if (!response || !response.data) {
        return null;
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching assignment with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }

  async create(assignmentData) {
    try {
      const params = {
        records: [{
          Name: assignmentData.title || assignmentData.title_c || assignmentData.Name,
          title_c: assignmentData.title || assignmentData.title_c,
          course_id_c: assignmentData.courseId ? assignmentData.courseId.toString() : (assignmentData.course_id_c ? assignmentData.course_id_c.toString() : ""),
          due_date_c: assignmentData.dueDate || assignmentData.due_date_c,
          priority_c: assignmentData.priority || assignmentData.priority_c || "medium",
          status_c: assignmentData.status || assignmentData.status_c || "todo",
          description_c: assignmentData.description || assignmentData.description_c || "",
          grade_c: assignmentData.grade || assignmentData.grade_c || 0
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
          console.error(`Failed to create assignment ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error creating assignment:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }

  async update(id, assignmentData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: assignmentData.title || assignmentData.title_c || assignmentData.Name,
          title_c: assignmentData.title || assignmentData.title_c,
          course_id_c: assignmentData.courseId ? assignmentData.courseId.toString() : (assignmentData.course_id_c ? assignmentData.course_id_c.toString() : undefined),
          due_date_c: assignmentData.dueDate || assignmentData.due_date_c,
          priority_c: assignmentData.priority || assignmentData.priority_c,
          status_c: assignmentData.status || assignmentData.status_c,
          description_c: assignmentData.description || assignmentData.description_c,
          grade_c: assignmentData.grade || assignmentData.grade_c
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
          console.error(`Failed to update assignment ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
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
        console.error("Error updating assignment:", error?.response?.data?.message);
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
          console.error(`Failed to delete assignment ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
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
        console.error("Error deleting assignment:", error?.response?.data?.message);
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
          { field: { Name: "title_c" } },
          { field: { Name: "course_id_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "grade_c" } }
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
        console.error("Error fetching assignments by course:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  }

  async getByStatus(status) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "course_id_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "grade_c" } }
        ],
        where: [
          {
            FieldName: "status_c",
            Operator: "EqualTo",
            Values: [status]
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
        console.error("Error fetching assignments by status:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  }

  async getUpcoming(days = 7) {
    try {
      const today = new Date();
      const futureDate = new Date(today.getTime() + (days * 24 * 60 * 60 * 1000));
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "course_id_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "grade_c" } }
        ],
        whereGroups: [
          {
            operator: "AND",
            subGroups: [
              {
                conditions: [
                  {
                    fieldName: "due_date_c",
                    operator: "GreaterThanOrEqualTo",
                    values: [today.toISOString().split('T')[0]]
                  }
                ]
              },
              {
                conditions: [
                  {
                    fieldName: "due_date_c",
                    operator: "LessThanOrEqualTo",
                    values: [futureDate.toISOString().split('T')[0]]
                  }
                ]
              },
              {
                conditions: [
                  {
                    fieldName: "status_c",
                    operator: "EqualTo",
                    values: ["todo"]
                  }
                ]
              }
            ]
          }
        ],
        orderBy: [
          {
            fieldName: "due_date_c",
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
        console.error("Error fetching upcoming assignments:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  }

  async toggleComplete(id) {
    try {
      // First get current assignment to check status
      const current = await this.getById(id);
      if (!current) {
        throw new Error("Assignment not found");
      }
      
      const newStatus = current.status_c === "completed" ? "todo" : "completed";
      
      const params = {
        records: [{
          Id: parseInt(id),
          status_c: newStatus
        }]
      };
      
      const response = await this.client.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return result.data;
        } else {
          if (result.message) toast.error(result.message);
          return null;
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error toggling assignment completion:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }
}

export const assignmentService = new AssignmentService();