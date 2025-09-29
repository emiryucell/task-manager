import React, { useEffect, useState, useCallback, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Paginator } from 'primereact/paginator';
import { Card } from 'primereact/card';
import { Task } from '../../types';
import { taskService } from '../../services/api';
import { Dialog } from 'primereact/dialog';
import TaskDetail from './TaskDetail';
import TaskForm from './TaskForm';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import 'primeflex/primeflex.css';

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [sortField, setSortField] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<1 | -1>(1);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [createVisible, setCreateVisible] = useState(false);
  const toast = useRef<any>(null);

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      const page = Math.floor(first / rows);
      
 
      let sort: string | undefined;
      if (sortField) {
        const direction = sortOrder === 1 ? 'asc' : 'desc';
        sort = `${sortField},${direction}`;
      }
      
      const response = await taskService.getAllTasks({ 
        page, 
        size: rows, 
        sort 
      });
      setTasks(response.content);
      setTotalRecords(response.totalElements);
    } catch (error) {
      console.error("Error loading tasks:", error);
      showToast('error', 'Error', 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [first, rows, sortField, sortOrder]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const showToast = (severity: 'success' | 'error' | 'info', summary: string, detail: string) => {
    toast.current?.show({ severity, summary, detail, life: 3000 });
  };

  const onPage = (event: any) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  const onSort = (event: any) => {
    setSortField(event.sortField);
    setSortOrder(event.sortOrder);
    setFirst(0); 
  };

  const formatDate = (rowData: Task) => {
    const date = new Date(rowData.taskDate);
    return date.toLocaleDateString();
  };

  const actionTemplate = (rowData: Task) => {
    return (
      <div className="flex justify-content-center gap-2">
        <Button 
          icon="pi pi-eye" 
          className="p-button-rounded p-button-info p-button-outlined p-button-sm"
          onClick={() => viewTaskDetails(rowData)}
          tooltip="View Details"
        />
      </div>
    );
  };

  const viewTaskDetails = (task: Task) => {
    setSelectedTask(task);
    setDetailVisible(true);
  };

  const handleCreateTask = () => {
    setCreateVisible(true);
  };

  const handleTaskCreated = () => {
    setCreateVisible(false);
    loadTasks();
    showToast('success', 'Success', 'Task created successfully');
  };

  const handleTaskUpdated = () => {
    setDetailVisible(false);
    loadTasks();
    showToast('success', 'Success', 'Task updated successfully');
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await taskService.deleteTask(taskId);
      loadTasks();
      setDetailVisible(false);
      showToast('success', 'Success', 'Task deleted successfully');
    } catch (error) {
      console.error("Error deleting task:", error);
      showToast('error', 'Error', 'Failed to delete task');
    }
  };

  const confirmDelete = (taskId: string) => {
    confirmDialog({
      message: 'Are you sure you want to delete this task?',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => handleDeleteTask(taskId),
    });
  };

  return (
    <div className="p-3">
      <Toast ref={toast} />
      <ConfirmDialog />
      
      <Card title="My Tasks" className="mb-3">
        <div className="flex justify-content-end mb-3">
          <Button 
            label="Create New Task" 
            icon="pi pi-plus" 
            onClick={handleCreateTask}
          />
        </div>
        
        <DataTable 
          value={tasks} 
          loading={loading}
          emptyMessage="No tasks found"
          className="p-datatable-sm"
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={onSort}
        >
          <Column field="taskName" header="Task Name" sortable style={{ width: '30%' }} />
          <Column field="taskDate" header="Date" body={formatDate} sortable style={{ width: '20%' }} />
          <Column field="durationInHour" header="Duration (Hours)" sortable style={{ width: '20%' }} />
          <Column body={actionTemplate} header="Actions" style={{ width: '10%', textAlign: 'center' }} />
        </DataTable>
        
        <Paginator 
          first={first} 
          rows={rows} 
          totalRecords={totalRecords} 
          onPageChange={onPage} 
          className="mt-3"
        />
      </Card>

      <Dialog 
        header="Task Details" 
        visible={detailVisible} 
        style={{ width: '50vw' }} 
        onHide={() => setDetailVisible(false)}
        modal
      >
        {selectedTask && (
          <TaskDetail 
            task={selectedTask} 
            onUpdate={handleTaskUpdated}
            onDelete={() => confirmDelete(selectedTask.taskId!)}
          />
        )}
      </Dialog>

      <Dialog
        header="Create New Task"
        visible={createVisible}
        style={{ width: '50vw' }}
        onHide={() => setCreateVisible(false)}
        modal
      >
        <TaskForm onSave={handleTaskCreated} />
      </Dialog>
    </div>
  );
};

export default TaskList; 