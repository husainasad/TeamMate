import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskForm from './../../../components/Tasks/TaskForm';
import { PRIORITY_CHOICES } from './../../../components/Tasks/Choices';

describe('TaskForm Component', () => {
    test('renders with default values when no initialData is provided', () => {
        render(<TaskForm initialData={{}} onSubmit={() => {}} onCancel={() => {}} />);

        expect(screen.getByLabelText(/Title:/)).toHaveValue('');
        expect(screen.getByLabelText(/Description:/)).toHaveValue('');
        expect(screen.getByLabelText(/Due Date:/)).toHaveValue(new Date().toISOString().split('T')[0]);
        expect(screen.getByLabelText(/Tags \(comma-separated\):/)).toHaveValue('');
        expect(screen.getByLabelText(/Priority:/)).toHaveValue('High');
        expect(screen.getByLabelText(/Progress \(%\):/)).toHaveValue(0);
    });

    test('renders with provided initialData', () => {
        const initialData = {
            title: 'Sample Task',
            description: 'This is a description',
            due_date: '2024-12-31',
            tags: [{ name: 'tag1' }, { name: 'tag2' }],
            priority: 'Medium',
            progress: 50,
        };

        render(<TaskForm initialData={initialData} onSubmit={() => {}} onCancel={() => {}} />);
        screen.debug();

        expect(screen.getByLabelText(/Title:/)).toHaveValue('Sample Task');
        expect(screen.getByLabelText(/Description:/)).toHaveValue('This is a description');
        expect(screen.getByLabelText(/Due Date:/)).toHaveValue('2024-12-31');
        expect(screen.getByLabelText(/Tags \(comma-separated\):/)).toHaveValue('tag1, tag2');
        expect(screen.getByLabelText(/Priority:/)).toHaveValue('Medium');
        expect(screen.getByLabelText(/Progress \(%\):/)).toHaveValue(50);
    });

    test('updates tags input on change', () => {
        render(<TaskForm initialData={{}} onSubmit={() => {}} onCancel={() => {}} />);

        const tagsInput = screen.getByLabelText(/Tags \(comma-separated\):/);
        fireEvent.change(tagsInput, { target: { value: 'tag1, tag2, tag3' } });
        
        expect(tagsInput).toHaveValue('tag1, tag2, tag3');
    });

    test('submits form with correct tag data', () => {
        const handleSubmit = jest.fn();

        render(<TaskForm initialData={{}} onSubmit={handleSubmit} onCancel={() => {}} />);

        fireEvent.change(screen.getByLabelText(/Title:/), { target: { value: 'New Task' } });
        fireEvent.change(screen.getByLabelText(/Tags \(comma-separated\):/), { target: { value: 'tag1, tag2' } });
        fireEvent.click(screen.getByText(/Submit/));

        expect(handleSubmit).toHaveBeenCalledWith(expect.objectContaining({
            title: 'New Task',
            tags: ['tag1', 'tag2'],
        }));
    });
});