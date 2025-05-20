import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditProfileModal from '../user/Profile/EditProfileModal';

const mockProfileData = {
  name: 'Test User',
  phone: '0501234567',
  fitnessLevel: 'intermediate',
  preferredWorkouts: ['strength', 'cardio'],
  birthDate: '1990-01-01',
  gender: 'male',
  idNumber: '123456789',
  city: 'Test City',
  avatarUrl: 'http://example.com/avatar.jpg',
};

const mockUser = {
  email: 'test@example.com',
};

const mockWorkoutTypes = [
  { id: 'strength', label: 'כוח' },
  { id: 'cardio', label: 'אירובי' },
  { id: 'flexibility', label: 'גמישות' },
];

const mockOnSubmit = jest.fn();
const mockOnCancel = jest.fn();

describe('EditProfileModal Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders modal with profile data', () => {
    render(
      <EditProfileModal
        profileData={mockProfileData}
        user={mockUser}
        submitting={false}
        workoutTypes={mockWorkoutTypes}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText('עריכת פרופיל')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('הכנס שם מלא')).toHaveValue(mockProfileData.name);
    expect(screen.getByDisplayValue(mockUser.email)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('הכנס מספר טלפון')).toHaveValue(mockProfileData.phone);
    expect(screen.getByDisplayValue(mockProfileData.birthDate)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockProfileData.gender)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('מספר תעודת זהות')).toHaveValue(mockProfileData.idNumber);
    expect(screen.getByPlaceholderText('הכנס שם עיר')).toHaveValue(mockProfileData.city);
    expect(screen.getByDisplayValue(mockProfileData.fitnessLevel)).toBeInTheDocument();
    
    mockWorkoutTypes.forEach(type => {
      expect(screen.getByLabelText(type.label)).toBeInTheDocument();
    });
  });

  test('calls onCancel when cancel button is clicked', () => {
    render(
      <EditProfileModal
        profileData={mockProfileData}
        user={mockUser}
        submitting={false}
        workoutTypes={mockWorkoutTypes}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.click(screen.getByText('ביטול'));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  test('calls onCancel when close button (X) is clicked', () => {
    render(
      <EditProfileModal
        profileData={mockProfileData}
        user={mockUser}
        submitting={false}
        workoutTypes={mockWorkoutTypes}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.click(screen.getByText('×'));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  test('updates form data on input change', () => {
    render(
      <EditProfileModal
        profileData={mockProfileData}
        user={mockUser}
        submitting={false}
        workoutTypes={mockWorkoutTypes}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const nameInput = screen.getByPlaceholderText('הכנס שם מלא');
    fireEvent.change(nameInput, { target: { value: 'New Name' } });
    expect(nameInput).toHaveValue('New Name');

    const phoneInput = screen.getByPlaceholderText('הכנס מספר טלפון');
    fireEvent.change(phoneInput, { target: { value: '0509876543' } });
    expect(phoneInput).toHaveValue('0509876543');
  });

  test('updates preferred workouts on checkbox change', () => {
    render(
      <EditProfileModal
        profileData={mockProfileData}
        user={mockUser}
        submitting={false}
        workoutTypes={mockWorkoutTypes}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const flexibilityCheckbox = screen.getByLabelText('גמישות');
    fireEvent.click(flexibilityCheckbox);
    expect(flexibilityCheckbox).toBeChecked();

    fireEvent.click(flexibilityCheckbox);
    expect(flexibilityCheckbox).not.toBeChecked();

    const cardioCheckbox = screen.getByLabelText('אירובי');
    expect(cardioCheckbox).toBeChecked();
    fireEvent.click(cardioCheckbox);
    expect(cardioCheckbox).not.toBeChecked();
  });
  
  test('calls onSubmit with correct data when form is submitted', () => {
    render(
      <EditProfileModal
        profileData={mockProfileData}
        user={mockUser}
        submitting={false}
        workoutTypes={mockWorkoutTypes}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const newName = 'Updated Test User';
    const newPhone = '0522222222';
    const newFitnessLevel = 'advanced';
    const newBirthDate = '1985-05-05';
    const newGender = 'female';
    const newIdNumber = '987654321';
    const newCity = 'New City';

    fireEvent.change(screen.getByPlaceholderText('הכנס שם מלא'), { target: { value: newName } });
    fireEvent.change(screen.getByPlaceholderText('הכנס מספר טלפון'), { target: { value: newPhone } });
    fireEvent.change(screen.getByDisplayValue(mockProfileData.birthDate), { target: { value: newBirthDate } });
    fireEvent.change(screen.getByDisplayValue(mockProfileData.gender), { target: { value: newGender } });
    fireEvent.change(screen.getByPlaceholderText('מספר תעודת זהות'), { target: { value: newIdNumber } });
    fireEvent.change(screen.getByPlaceholderText('הכנס שם עיר'), { target: { value: newCity } });
    fireEvent.change(screen.getByDisplayValue(mockProfileData.fitnessLevel), { target: { value: newFitnessLevel } });

    const cardioCheckbox = screen.getByLabelText('אירובי');
    const flexibilityCheckbox = screen.getByLabelText('גמישות');
    
    fireEvent.click(cardioCheckbox);
    fireEvent.click(flexibilityCheckbox);

    fireEvent.click(screen.getByText('שמור שינויים'));

    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: newName,
      phone: newPhone,
      fitness_level: newFitnessLevel,
      preferred_workouts: ['strength', 'flexibility'],
      birth_date: newBirthDate,
      gender: newGender,
      id_number: newIdNumber,
      city: newCity,
      avatar_url: mockProfileData.avatarUrl,
      email: mockUser.email,
    });
  });

  test('displays "שומר..." text and disables buttons when submitting', () => {
    render(
      <EditProfileModal
        profileData={mockProfileData}
        user={mockUser}
        submitting={true}
        workoutTypes={mockWorkoutTypes}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText(/שומר.../i)).toBeInTheDocument();
    expect(screen.getByText('ביטול').closest('button')).toBeDisabled();
    expect(screen.getByText(/שומר.../i).closest('button')).toBeDisabled();
  });
}); 