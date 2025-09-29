import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Task } from '../../types';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import { taskService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { Message } from 'primereact/message';
import { extractErrorMessages } from '../../utils/errorUtils';
import 'primeflex/primeflex.css';

interface TaskDetailProps {
  task: Task;
  onUpdate: () => void;
  onDelete: () => void;
}

const TaskDetail: React.FC<TaskDetailProps> = ({ task, onUpdate, onDelete }) => {
  const [editMode, setEditMode] = useState(false);
  const [editTask, setEditTask] = useState<Task>({ ...task });
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  
  const currentUser = useAuth().user; 
  const isAdmin = currentUser?.role === 'admin';
  const canEdit = (isAdmin || task.username === currentUser?.username);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    setEditTask({ ...task });
    setErrorMessages([]);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setErrorMessages([]);

      if (!editTask.taskName.trim()) {
        setErrorMessages(['Task name is required']);
        return;
      }

      const formattedTask = {
        ...editTask,
        taskDate: editTask.taskDate instanceof Date ? editTask.taskDate.toISOString() : new Date(editTask.taskDate).toISOString()
      };
      
      await taskService.updateTask(task.taskId!, formattedTask as any);
      setEditMode(false);
      onUpdate();
    } catch (err: any) {
      const errorMessages = extractErrorMessages(err);
      setErrorMessages(errorMessages);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-fluid">
      {errorMessages.length > 0 && (
        <div className="mb-3">
          {errorMessages.map((err, index) => (
            <Message key={index} severity="error" text={err} className="mb-2" />
          ))}
        </div>
      )}
      
      <div className="field">
        <label htmlFor="taskName" className="font-bold">Task Name</label>
        {editMode ? (
          <InputText
            id="taskName"
            value={editTask.taskName}
            onChange={(e) => setEditTask({ ...editTask, taskName: e.target.value })}
          />
        ) : (
          <div className="p-2 border-1 border-300 border-round">{task.taskName}</div>
        )}
      </div>
      
      <div className="field">
        <label htmlFor="taskDescription" className="font-bold">Description</label>
        {editMode ? (
          <InputTextarea
            id="taskDescription"
            value={editTask.taskDescription}
            onChange={(e) => setEditTask({ ...editTask, taskDescription: e.target.value })}
            rows={5}
          />
        ) : (
          <div className="p-2 border-1 border-300 border-round" style={{ minHeight: '100px' }}>
            {task.taskDescription}
          </div>
        )}
      </div>
      
      <div className="formgrid grid">
        <div className="field col-12 md:col-6">
          <label htmlFor="taskDate" className="font-bold">Date</label>
          {editMode ? (
            <Calendar
              id="taskDate"
              value={new Date(editTask.taskDate)}
              onChange={(e) => setEditTask({ ...editTask, taskDate: e.value as Date })}
              showIcon
              dateFormat="dd/mm/yy"
            />
          ) : (
            <div className="p-2 border-1 border-300 border-round">
              {new Date(task.taskDate).toLocaleDateString()}
            </div>
          )}
        </div>
        
        <div className="field col-12 md:col-6">
          <label htmlFor="duration" className="font-bold">Duration (Hours)</label>
          {editMode ? (
            <InputNumber
              id="duration"
              value={editTask.durationInHour}
              onValueChange={(e) => setEditTask({ ...editTask, durationInHour: e.value || 0 })}
              min={2}
              showButtons
            />
          ) : (
            <div className="p-2 border-1 border-300 border-round">
              {task.durationInHour}
            </div>
          )}
        </div>
      </div>
      
      <div className="field">
        <label htmlFor="username" className="font-bold">Assigned To</label>
        <div className="p-2 border-1 border-300 border-round">
          {task.username}
        </div>
      </div>
      
      <div className="flex justify-content-end gap-2 mt-3">
        {editMode ? (
          <>
            <Button
              label="Cancel"
              icon="pi pi-times"
              className="p-button-outlined p-button-secondary"
              onClick={handleCancel}
            />
            <Button
              label="Save"
              icon="pi pi-check"
              loading={loading}
              onClick={handleSave}
            />
          </>
        ) : (
          <>
            {canEdit && (
              <>
                <Button
                  label="Edit"
                  icon="pi pi-pencil"
                  className="p-button-outlined"
                  onClick={handleEdit}
                />
                <Button
                  label="Delete"
                  icon="pi pi-trash"
                  className="p-button-danger"
                  onClick={onDelete}
                />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TaskDetail; 