import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import { Task } from '../../types';
import { taskService } from '../../services/api';
import { Message } from 'primereact/message';
import { extractErrorMessages } from '../../utils/errorUtils';
import 'primeflex/primeflex.css';

interface TaskFormProps {
  onSave: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSave }) => {
  const [task, setTask] = useState<Task>({
    taskName: '',
    taskDescription: '',
    taskDate: new Date(),
    durationInHour: 2
  });
  
  const [loading, setLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setErrorMessages([]);
      
      if (!task.taskName.trim()) {
        setErrorMessages(['Task name is required']);
        return;
      }
      
      const formattedTask = {
        ...task,
        taskDate: task.taskDate instanceof Date ? task.taskDate.toISOString() : new Date(task.taskDate).toISOString()
      };
      
      await taskService.createTask(formattedTask as any);
      onSave();
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
        <label htmlFor="taskName" className="font-bold">Task Name*</label>
        <InputText
          id="taskName"
          name="taskName"
          value={task.taskName}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="field">
        <label htmlFor="taskDescription" className="font-bold">Description*</label>
        <small className="p-error block mb-1">Minimum 10 characters</small>
        <InputTextarea
          id="taskDescription"
          name="taskDescription"
          value={task.taskDescription}
          onChange={handleInputChange}
          rows={5}
          required
        />
      </div>

      <div className="formgrid grid">
        <div className="field col-12 md:col-6">
          <label htmlFor="taskDate" className="font-bold">Date*</label>
          <Calendar
            id="taskDate"
            value={task.taskDate instanceof Date ? task.taskDate : new Date(task.taskDate)}
            onChange={(e) => setTask({ ...task, taskDate: e.value as Date })}
            showIcon
            dateFormat="dd/mm/yy"
            required
          />
        </div>

        <div className="field col-12 md:col-6">
          <label htmlFor="durationInHour" className="font-bold">Duration (Hours)*</label>
          <InputNumber
            id="durationInHour"
            value={task.durationInHour}
            onValueChange={(e) => setTask({ ...task, durationInHour: e.value || 0 })}
            min={0}
            showButtons
            required
          />
        </div>
      </div>

      <div className="flex justify-content-end gap-2 mt-3">
        <Button
          label="Create Task"
          icon="pi pi-check"
          loading={loading}
          onClick={handleSubmit}
        />
      </div>
    </div>
  );
};

export default TaskForm; 