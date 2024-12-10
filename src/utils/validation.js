import * as yup from 'yup';

export const projectSchema = yup.object().shape({
  title: yup
    .string()
    .required('Title is required')
    .min(3, 'Title must be at least 3 characters'),
  description: yup
    .string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters'),
  files: yup
    .array()
    .min(1, 'At least one file is required')
    .test('fileSize', 'File size too large', (files) => {
      if (!files) return true;
      return files.every((file) => file.size <= 10 * 1024 * 1024); // 10MB limit
    }),
});

export const settingsSchema = yup.object().shape({
  companyName: yup.string().required('Company name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  notificationsEnabled: yup.boolean(),
  autoApproval: yup.boolean(),
  maxProjectSize: yup.number().min(1, 'Must be at least 1MB'),
  defaultProjectStatus: yup.string().required('Default status is required'),
}); 