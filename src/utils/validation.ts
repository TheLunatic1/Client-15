import Swal from 'sweetalert2';

export type ValidationResult = { ok: true } | { ok: false; message: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
const NAME_RE = /^[a-zA-ZÀ-ÿ][a-zA-ZÀ-ÿ\s'.-]{1,49}$/;
const PHONE_RE = /^(?:\+?61|0)[2-478](?:[ -]?\d){8}$/;
const ABN_RE = /^\d{11}$/;
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const showValidationAlert = (message: string, title = 'Invalid Input') => {
  Swal.fire({
    title,
    text: message,
    icon: 'warning',
    confirmButtonColor: '#097DDD',
  });
};

const fail = (message: string): ValidationResult => ({ ok: false, message });
const pass = (): ValidationResult => ({ ok: true });

export const trim = (v: string) => v.trim();

export const validateRequired = (value: string, label: string): ValidationResult => {
  if (!trim(value)) return fail(`${label} is required.`);
  return pass();
};

export const validateEmail = (email: string): ValidationResult => {
  const v = trim(email);
  if (!v) return fail('Email address is required.');
  if (v.length > 254) return fail('Email address is too long.');
  if (!EMAIL_RE.test(v)) return fail('Please enter a valid email address.');
  return pass();
};

export const validatePassword = (password: string, label = 'Password'): ValidationResult => {
  if (!password) return fail(`${label} is required.`);
  if (password.length < 8) return fail(`${label} must be at least 8 characters.`);
  if (password.length > 128) return fail(`${label} is too long (max 128 characters).`);
  if (!/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
    return fail(`${label} must include at least one letter and one number.`);
  }
  return pass();
};

export const validatePasswordMatch = (
  password: string,
  confirm: string
): ValidationResult => {
  if (password !== confirm) return fail('Passwords do not match.');
  return pass();
};

export const validateNamePart = (value: string, label: string): ValidationResult => {
  const v = trim(value);
  if (!v) return fail(`${label} is required.`);
  if (v.length < 2) return fail(`${label} must be at least 2 characters.`);
  if (v.length > 50) return fail(`${label} must be 50 characters or less.`);
  if (!NAME_RE.test(v)) return fail(`${label} can only contain letters, spaces, hyphens and apostrophes.`);
  return pass();
};

export const validateFullName = (fullName: string): ValidationResult => {
  const v = trim(fullName);
  if (!v) return fail('Full name is required.');
  const parts = v.split(/\s+/).filter(Boolean);
  if (parts.length < 2) return fail('Please enter your first and last name (e.g. John Smith).');
  for (const part of parts) {
    const check = validateNamePart(part, 'Name');
    if (!check.ok) return check;
  }
  return pass();
};

export const validatePhoneAU = (phone: string, required = true): ValidationResult => {
  const raw = trim(phone);
  if (!raw) return required ? fail('Phone number is required.') : pass();
  const normalized = raw.replace(/[\s()-]/g, '');
  if (!PHONE_RE.test(normalized)) {
    return fail('Please enter a valid Australian phone number (e.g. 0412 345 678).');
  }
  return pass();
};

export const validateAbn = (abn: string): ValidationResult => {
  const digits = trim(abn).replace(/\s/g, '');
  if (!digits) return fail('ABN is required.');
  if (!ABN_RE.test(digits)) return fail('ABN must be exactly 11 digits.');
  return pass();
};

export const validateWebsite = (website: string): ValidationResult => {
  const v = trim(website);
  if (!v) return pass();
  const withProtocol = /^https?:\/\//i.test(v) ? v : `https://${v}`;
  try {
    const url = new URL(withProtocol);
    if (!url.hostname.includes('.')) return fail('Please enter a valid website URL.');
  } catch {
    return fail('Please enter a valid website URL.');
  }
  return pass();
};

export const validateBusinessName = (name: string): ValidationResult => {
  const v = trim(name);
  if (!v) return fail('Business name is required.');
  if (v.length < 2) return fail('Business name must be at least 2 characters.');
  if (v.length > 100) return fail('Business name must be 100 characters or less.');
  return pass();
};

export const validateSelect = (value: string, label: string): ValidationResult => {
  if (!trim(value)) return fail(`Please select a ${label}.`);
  return pass();
};

export const validateTextLength = (
  value: string,
  label: string,
  min: number,
  max: number,
  required = true
): ValidationResult => {
  const v = trim(value);
  if (!v) return required ? fail(`${label} is required.`) : pass();
  if (v.length < min) return fail(`${label} must be at least ${min} characters.`);
  if (v.length > max) return fail(`${label} must be ${max} characters or less.`);
  return pass();
};

export const validateYearsInBusiness = (years: string): ValidationResult => {
  const v = trim(years);
  if (!v) return pass();
  const n = Number(v);
  if (!Number.isFinite(n) || n < 0 || n > 100 || !Number.isInteger(n)) {
    return fail('Years in business must be a whole number between 0 and 100.');
  }
  return pass();
};

export const validateRating = (rating: number): ValidationResult => {
  if (!rating || rating < 1 || rating > 5) return fail('Please select a rating between 1 and 5 stars.');
  return pass();
};

export const validateSlug = (slug: string): ValidationResult => {
  const v = trim(slug);
  if (!v) return fail('Slug is required.');
  if (!SLUG_RE.test(v)) return fail('Slug can only contain lowercase letters, numbers and hyphens.');
  return pass();
};

/** Run validators in order; returns first failure */
export const runValidations = (...checks: ValidationResult[]): ValidationResult => {
  for (const check of checks) {
    if (!check.ok) return check;
  }
  return pass();
};

export const validateLogin = (email: string, password: string): ValidationResult =>
  runValidations(validateEmail(email), validateRequired(password, 'Password'));

export const validateCustomerRegistration = (data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}): ValidationResult =>
  runValidations(
    validateNamePart(data.firstName, 'First name'),
    validateNamePart(data.lastName, 'Last name'),
    validateEmail(data.email),
    validatePassword(data.password)
  );

export const validateTradieRegistration = (data: {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  businessName?: string;
  agreeToTerms: boolean;
}): ValidationResult => {
  const checks: ValidationResult[] = [
    validateFullName(data.fullName),
    validateEmail(data.email),
    validatePassword(data.password),
    validatePasswordMatch(data.password, data.confirmPassword),
  ];
  if (trim(data.businessName || '')) {
    checks.push(validateBusinessName(data.businessName!));
  }
  if (!data.agreeToTerms) {
    return fail('You must agree to the Terms & Conditions and Privacy Policy.');
  }
  return runValidations(...checks);
};

export const validateListBusinessForm = (data: {
  businessName: string;
  category: string;
  location: string;
  shortDescription: string;
  servicesOffered: string;
  abn: string;
  contactPhone: string;
  contactEmail: string;
  website?: string;
  yearsInBusiness?: string;
  contactName?: string;
}): ValidationResult =>
  runValidations(
    validateBusinessName(data.businessName),
    validateSelect(data.category, 'service category'),
    validateSelect(data.location, 'location'),
    validateTextLength(data.shortDescription, 'Business description', 20, 500),
    validateTextLength(data.servicesOffered, 'Services offered', 3, 300),
    validateAbn(data.abn),
    validatePhoneAU(data.contactPhone, true),
    validateEmail(data.contactEmail),
    validateWebsite(data.website || ''),
    validateYearsInBusiness(data.yearsInBusiness || '')
  );

export const validateContactForm = (data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): ValidationResult =>
  runValidations(
    validateFullName(data.name),
    validateEmail(data.email),
    validateTextLength(data.subject, 'Subject', 3, 120),
    validateTextLength(data.message, 'Message', 10, 2000)
  );

export const validateProfileDetails = (data: {
  firstName: string;
  lastName: string;
  phone?: string;
}): ValidationResult =>
  runValidations(
    validateNamePart(data.firstName, 'First name'),
    validateNamePart(data.lastName, 'Last name'),
    data.phone ? validatePhoneAU(data.phone, false) : pass()
  );

export const validatePasswordChange = (data: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): ValidationResult =>
  runValidations(
    validateRequired(data.currentPassword, 'Current password'),
    validatePassword(data.newPassword, 'New password'),
    validatePasswordMatch(data.newPassword, data.confirmPassword)
  );

export const validateReview = (rating: number, comment: string): ValidationResult =>
  runValidations(
    validateRating(rating),
    validateTextLength(comment, 'Review comment', 10, 1000)
  );

export const validateRejectionReason = (reason: string): ValidationResult =>
  validateTextLength(reason, 'Rejection message', 10, 1000);

export const validateBlogForm = (data: {
  title: string;
  category: string;
  excerpt: string;
  content: string;
  image: string;
  writer?: string;
}): ValidationResult =>
  runValidations(
    validateTextLength(data.title, 'Title', 3, 150),
    validateRequired(data.category, 'Category'),
    validateTextLength(data.excerpt, 'Excerpt', 10, 300),
    validateTextLength(data.content, 'Content', 20, 20000),
    validateRequired(data.image, 'Cover image')
  );

export const validateCategoryForm = (data: { name: string; slug: string }): ValidationResult =>
  runValidations(
    validateTextLength(data.name, 'Category name', 2, 80),
    validateSlug(data.slug)
  );

export const validateLocationForm = (data: { city: string; region: string }): ValidationResult =>
  runValidations(
    validateTextLength(data.city, 'City/area name', 2, 80),
    validateTextLength(data.region, 'Region', 2, 10)
  );
