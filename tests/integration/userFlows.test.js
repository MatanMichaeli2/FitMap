import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter, Routes, Route } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { supabase } from '../../../utils/supabaseClient';
import ProfilePage from '../../user/Profile/ProfilePage';
import WorkoutGenerator from '../../workouts/WorkoutGenerator';
import ExerciseLibrary from '../../workouts/ExerciseLibrary';
import Favorites from '../../user/Favorites';

// Mock dependencies
jest.mock('../../../hooks/useAuth');
jest.mock('../../../utils/supabaseClient');

describe('User Flow Integration Tests', () => {
  const mockUser = {
    id: '123',
    email: 'test@example.com'
  };

  const mockUserProfile = {
    name: 'Test User',
    phone: '0501234567',
    fitness_level: 'beginner',
    preferred_workouts: ['cardio', 'strength'],
    birth_date: '1990-01-01',
    gender: 'male',
    id_number: '123456789',
    city: 'Tel Aviv',
    avatar_url: ''
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock useAuth hook
    useAuth.mockReturnValue({ 
      user: mockUser, 
      userProfile: mockUserProfile,
      loading: false 
    });

    // Mock supabase queries
    supabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: [], error: null }),
      single: jest.fn().mockResolvedValue({ data: mockUserProfile, error: null })
    });
  });

  // Test 1: Complete Profile Setup Flow
  test('User can complete profile setup and navigate to workout generation', async () => {
    render(
      <MemoryRouter initialEntries={['/profile']}>
        <Routes>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/workout-generator" element={<WorkoutGenerator />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    // Open edit modal
    const editButton = screen.getByText('ערוך פרופיל');
    fireEvent.click(editButton);

    // Wait for modal to appear and form to be ready
    await waitFor(() => {
      expect(screen.getByText('עריכת פרופיל')).toBeInTheDocument();
    });

    // Fill in profile details using role selectors
    const nameInput = screen.getByRole('textbox', { name: /שם מלא/i });
    const phoneInput = screen.getByRole('textbox', { name: /טלפון/i });
    const fitnessLevelSelect = screen.getByRole('combobox', { name: /רמת כושר/i });

    fireEvent.change(nameInput, { target: { value: 'New Name' } });
    fireEvent.change(phoneInput, { target: { value: '0509876543' } });
    fireEvent.change(fitnessLevelSelect, { target: { value: 'advanced' } });

    // Save changes
    const saveButton = screen.getByRole('button', { name: /שמור שינויים/i });
    fireEvent.click(saveButton);

    // Verify profile update
    await waitFor(() => {
      expect(supabase.from().update).toHaveBeenCalledWith({
        name: 'New Name',
        phone: '0509876543',
        fitness_level: 'advanced',
        preferred_workouts: ['cardio', 'strength']
      });
    });
  });

  // Test 2: Workout Generation and Exercise Selection Flow
  test('User can generate workout and select exercises', async () => {
    const mockExercises = [
      { id: 1, name: 'שכיבות סמיכה', difficulty: 'intermediate' },
      { id: 2, name: 'סקוואט', difficulty: 'beginner' }
    ];

    supabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: mockExercises, error: null })
    });

    render(
      <MemoryRouter initialEntries={['/workout-generator']}>
        <Routes>
          <Route path="/workout-generator" element={<WorkoutGenerator />} />
          <Route path="/exercises" element={<ExerciseLibrary />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for workout generator to load
    await waitFor(() => {
      expect(screen.getByText('יצירת תוכנית אימון')).toBeInTheDocument();
    });

    // Select workout parameters using role selectors
    const strengthButton = screen.getByRole('button', { name: /כוח/i });
    const intermediateButton = screen.getByRole('button', { name: /בינונית/i });
    const generateButton = screen.getByRole('button', { name: /יצירת תוכנית אימון/i });

    fireEvent.click(strengthButton);
    fireEvent.click(intermediateButton);
    fireEvent.click(generateButton);

    // Verify workout generation
    await waitFor(() => {
      expect(screen.getByText('תוכנית האימון שלך')).toBeInTheDocument();
    });
  });

  // Test 3: Exercise Library and Favorites Flow
  test('User can browse exercises and add to favorites', async () => {
    const mockExercises = [
      { id: 1, name: 'שכיבות סמיכה', difficulty: 'intermediate' },
      { id: 2, name: 'סקוואט', difficulty: 'beginner' }
    ];

    supabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: mockExercises, error: null })
    });

    render(
      <MemoryRouter initialEntries={['/exercises']}>
        <Routes>
          <Route path="/exercises" element={<ExerciseLibrary />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for exercises to load
    await waitFor(() => {
      expect(screen.getByText('ספריית תרגילים')).toBeInTheDocument();
    });

    // Search for an exercise
    const searchInput = screen.getByPlaceholderText('חפש תרגילים...');
    fireEvent.change(searchInput, { target: { value: 'שכיבות' } });

    // Wait for search results
    await waitFor(() => {
      expect(screen.getByText('שכיבות סמיכה')).toBeInTheDocument();
    });

    // Add to favorites using role selector
    const favoriteButton = screen.getByRole('button', { name: /הוסף למועדפים/i });
    fireEvent.click(favoriteButton);

    // Verify favorite was added
    await waitFor(() => {
      expect(supabase.from().update).toHaveBeenCalled();
    });
  });

  // Test 4: Profile Statistics and History Flow
  test('User can view workout statistics and history', async () => {
    const mockWorkouts = [
      {
        id: 1,
        workout_name: 'אימון כוח',
        workout_date: '2024-05-01',
        duration_minutes: 45
      }
    ];

    supabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: mockWorkouts, error: null })
    });

    render(
      <MemoryRouter initialEntries={['/profile']}>
        <Routes>
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for profile to load
    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    // Navigate to statistics tab using role selector
    const statsTab = screen.getByRole('button', { name: /סטטיסטיקות/i });
    fireEvent.click(statsTab);

    // Verify statistics are displayed
    await waitFor(() => {
      expect(screen.getByText('סה"כ אימונים')).toBeInTheDocument();
      expect(screen.getByText('45 דקות')).toBeInTheDocument();
    });
  });

  // Test 5: Error Handling and Recovery Flow
  test('System handles errors gracefully and allows recovery', async () => {
    // Mock error response
    const mockError = new Error('Network error');
    supabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      eq: jest.fn().mockRejectedValue(mockError)
    });

    render(
      <MemoryRouter initialEntries={['/profile']}>
        <Routes>
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for profile to load
    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    // Open edit modal
    const editButton = screen.getByRole('button', { name: /ערוך פרופיל/i });
    fireEvent.click(editButton);

    // Wait for modal to appear
    await waitFor(() => {
      expect(screen.getByText('עריכת פרופיל')).toBeInTheDocument();
    });

    // Save changes
    const saveButton = screen.getByRole('button', { name: /שמור שינויים/i });
    fireEvent.click(saveButton);

    // Verify error message is displayed
    await waitFor(() => {
      expect(screen.getByText('אירעה שגיאה בעדכון הפרופיל')).toBeInTheDocument();
    });

    // Verify refresh button is available
    const refreshButton = screen.getByRole('button', { name: /רענן נתונים/i });
    expect(refreshButton).toBeInTheDocument();

    // Mock successful response for refresh
    supabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue({ data: mockUserProfile, error: null })
    });

    // Click refresh
    fireEvent.click(refreshButton);

    // Verify data is reloaded
    await waitFor(() => {
      expect(screen.queryByText('אירעה שגיאה בעדכון הפרופיל')).not.toBeInTheDocument();
    });
  });
}); 