import MockAdapter from 'axios-mock-adapter';
import { api, registerUser, loginUser, refreshToken, getMemberTasks, getTaskById, addTask, editTask, deleteTask, addMember, removeMember } from '../../services/Api';

describe('API service tests', () => {
    let mock;

    beforeEach(() => {
        mock = new MockAdapter(api);
    });

    afterEach(() => {
        mock.reset();
    });

    afterAll(() => {
        mock.restore();
    });

    it('should register a user', async () => {
        const userData = { username: 'testuser', password: 'password' };
        const response = { message: 'User registered successfully' };

        mock.onPost('/register/').reply(201, response);

        const result = await registerUser(userData);
        expect(result.data).toEqual(response);
    });

    it('should login a user', async () => {
        const userData = { username: 'testuser', password: 'password' };
        const response = { access: 'access_token', refresh: 'refresh_token' };

        mock.onPost('/token/').reply(200, response);

        const result = await loginUser(userData);
        expect(result.data).toEqual(response);
    });

    it('should refresh token', async () => {
        const token = 'refresh_token';
        const response = { access: 'new_access_token' };

        mock.onPost('/token/refresh/').reply(200, response);

        const result = await refreshToken(token);
        expect(result.data).toEqual(response);
    });

    it('should get member tasks', async () => {
        const tasks = [{ id: 1, name: 'Task 1' }];
        mock.onGet('/tasks/member/').reply(200, tasks);

        const result = await getMemberTasks();
        expect(result.data).toEqual(tasks);
    });

    it('should get task by ID', async () => {
        const task = { id: 1, name: 'Task 1' };
        const taskId = 1;

        mock.onGet(`/tasks/${taskId}/`).reply(200, task);

        const result = await getTaskById(taskId);
        expect(result.data).toEqual(task);
    });

    it('should add a new task', async () => {
        const taskData = { name: 'New Task' };
        const response = { id: 1, name: 'New Task' };

        mock.onPost('/tasks/add/').reply(201, response);

        const result = await addTask(taskData);
        expect(result.data).toEqual(response);
    });

    it('should edit a task', async () => {
        const taskData = { name: 'Updated Task' };
        const taskId = 1;

        mock.onPut(`/tasks/${taskId}/update/`).reply(200, taskData);

        const result = await editTask(taskId, taskData);
        expect(result.data).toEqual(taskData);
    });

    it('should delete a task', async () => {
        const taskId = 1;

        mock.onDelete(`/tasks/${taskId}/delete/`).reply(204);

        const result = await deleteTask(taskId);
        expect(result.status).toBe(204);
    });

    it('should add a member to a task', async () => {
        const taskData = { memberId: 2 };
        const taskId = 1;

        mock.onPost(`/tasks/${taskId}/addMember/`).reply(200, taskData);

        const result = await addMember(taskId, taskData);
        expect(result.data).toEqual(taskData);
    });

    it('should remove a member from a task', async () => {
        const taskData = { memberId: 2 };
        const taskId = 1;

        mock.onDelete(`/tasks/${taskId}/removeMember/`, { data: taskData }).reply(204);

        const result = await removeMember(taskId, taskData);
        expect(result.status).toBe(204);
    });
});