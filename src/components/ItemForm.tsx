import { useId, useState, type FormEvent } from 'react';
import type { ItemFormErrors, ItemFormField, ItemFormValues } from '../interfaces/form';
import type { ItemInput, ItemType, TrackedItem } from '../interfaces/item';
import {
  ITEM_STATUSES,
  ITEM_TYPES,
  TYPE_ICONS,
  TYPE_LABELS,
  getCreatorLabel,
  getStatusLabel,
} from '../utils/labels';
import { LIMITS, getMaxYear, isItemStatus, isItemType, validateItemForm } from '../utils/validation';
import Modal from './Modal';
import RatingInput from './RatingInput';

interface ItemFormProps {
  /** Verilirse form düzenleme modunda açılır. */
  item?: TrackedItem;
  /** Yeni kayıtta önceden seçili tür (ör. Filmler sayfasından açıldığında). */
  defaultType?: ItemType;
  onSubmit: (input: ItemInput) => void;
  onCancel: () => void;
}

const CURRENT_YEAR = new Date().getFullYear();
const MAX_YEAR = getMaxYear();

const FIELD_ORDER: ItemFormField[] =['title', 'type', 'status', 'year', 'creator', 'rating', 'note'];

const TITLE_PLACEHOLDERS: Record<ItemType, string> = {
  movie: 'Örn. Yıldızlararası',
  series: 'Örn. Breaking Bad',
  book: 'Örn. Kürk Mantolu Madonna',
};

const CREATOR_PLACEHOLDERS: Record<ItemType, string> = {
  movie: 'Örn. Christopher Nolan',
  series: 'Örn. Vince Gilligan',
  book: 'Örn. Sabahattin Ali',
};

function toFormValues(item?: TrackedItem, defaultType?: ItemType): ItemFormValues {
  if (item) {
    return {
      title: item.title,
      type: item.type,
      status: item.status,
      creator: item.creator ?? '',
      year: item.year?.toString() ?? '',
      rating: item.rating ?? null,
      note: item.note ?? '',
    };
  }
  return {
    title: '',
    type: defaultType ?? '',
    status: 'planned',
    creator: '',
    year: '',
    rating: null,
    note: '',
  };
}

function toItemInput(values: ItemFormValues, type: ItemType): ItemInput {
  const year = values.year.trim();
  return {
    title: values.title.trim(),
    type,
    status: values.status,
    creator: values.creator.trim() || undefined,
    year: year ? Number(year) : undefined,
    rating: values.rating ?? undefined,
    note: values.note.trim() || undefined,
  };
}

export default function ItemForm({ item, defaultType, onSubmit, onCancel }: ItemFormProps) {
  const idPrefix = useId();
  const [values, setValues] = useState<ItemFormValues>(() => toFormValues(item, defaultType));
  const [errors, setErrors] = useState<ItemFormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const isEdit = item !== undefined;
  const selectedType = values.type || undefined;
  const hasErrors = Object.keys(errors).length > 0;

  const fieldId = (field: ItemFormField) => `${idPrefix}-${field}`;
  const errorId = (field: ItemFormField) => `${fieldId(field)}-error`;

  function updateField<K extends ItemFormField>(field: K, value: ItemFormValues[K]) {
    const next: ItemFormValues = { ...values, [field]: value };
    setValues(next);
    // İlk gönderim denemesinden sonra hatalar yazdıkça güncellenir.
    if (submitted) setErrors(validateItemForm(next));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationErrors = validateItemForm(values);
    setSubmitted(true);
    setErrors(validationErrors);

    const firstInvalid = FIELD_ORDER.find((field) => validationErrors[field]);
    if (firstInvalid) {
      document.getElementById(fieldId(firstInvalid))?.focus();
      return;
    }
    if (isItemType(values.type)) {
      onSubmit(toItemInput(values, values.type));
    }
  }

  function inputProps(field: ItemFormField) {
    return {
      id: fieldId(field),
      'aria-invalid': errors[field] ? true : undefined,
      'aria-describedby': errors[field] ? errorId(field) : undefined,
    };
  }

  function renderError(field: ItemFormField) {
    const message = errors[field];
    if (!message) return null;
    return (
      <div className="form-feedback-custom invalid-custom" id={errorId(field)}>
        <i className="bi bi-exclamation-circle me-1" aria-hidden="true" />
        {message}
      </div>
    );
  }

  const invalidClass = (field: ItemFormField) => (errors[field] ? ' is-invalid-custom' : '');

  const modalTitle = isEdit
    ? 'Kaydı Düzenle'
    : defaultType
      ? `Yeni ${TYPE_LABELS[defaultType]} Ekle`
      : 'Yeni Kayıt Ekle';

  return (
    <Modal title={modalTitle} onClose={onCancel} closeOnBackdrop={false} size="lg">
      <form onSubmit={handleSubmit} noValidate>
        <div className="modal-body">
          {submitted && hasErrors && (
            <div className="alert-custom alert-custom-danger" role="alert">
              <i className="bi bi-exclamation-octagon alert-custom-icon" aria-hidden="true" />
              <div className="alert-custom-content">Kaydetmeden önce işaretli alanları düzelt.</div>
            </div>
          )}

          <div className="row g-3">
            <div className="col-12">
              <label className="form-label-custom" htmlFor={fieldId('title')}>
                Başlık <span className="required-mark" aria-hidden="true">*</span>
              </label>
              <input
                {...inputProps('title')}
                type="text"
                className={`form-control-custom${invalidClass('title')}`}
                placeholder={selectedType ? TITLE_PLACEHOLDERS[selectedType] : 'Film, dizi veya kitap adı'}
                value={values.title}
                required
                autoFocus
                onChange={(event) => updateField('title', event.target.value)}
              />
              {renderError('title')}
            </div>

            <div className="col-12">
              <fieldset aria-describedby={errors.type ? errorId('type') : undefined}>
                <legend className="form-label-custom">
                  Tür <span className="required-mark" aria-hidden="true">*</span>
                </legend>
                <div className={`type-options${errors.type ? ' is-invalid' : ''}`}>
                  {ITEM_TYPES.map((type, index) => {
                    const optionId = index === 0 ? fieldId('type') : `${fieldId('type')}-${type}`;
                    return (
                      <div className="type-option" key={type}>
                        <input
                          type="radio"
                          className="btn-check"
                          name={`${idPrefix}-type`}
                          id={optionId}
                          value={type}
                          checked={values.type === type}
                          onChange={() => updateField('type', type)}
                        />
                        <label htmlFor={optionId}>
                          <i className={`bi ${TYPE_ICONS[type]}`} aria-hidden="true" />
                          {TYPE_LABELS[type]}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </fieldset>
              {renderError('type')}
            </div>

            <div className="col-md-6">
              <label className="form-label-custom" htmlFor={fieldId('status')}>
                Durum
              </label>
              <select
                {...inputProps('status')}
                className="form-select-custom"
                value={values.status}
                onChange={(event) => {
                  if (isItemStatus(event.target.value)) updateField('status', event.target.value);
                }}
              >
                {ITEM_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {getStatusLabel(status)}
                  </option>
                ))}
              </select>
              {renderError('status')}
            </div>

            <div className="col-md-6">
              <label className="form-label-custom" htmlFor={fieldId('year')}>
                Yıl <span className="optional-mark">(opsiyonel)</span>
              </label>
              <input
                {...inputProps('year')}
                type="text"
                inputMode="numeric"
                className={`form-control-custom${invalidClass('year')}`}
                placeholder={`Örn. ${CURRENT_YEAR}`}
                value={values.year}
                maxLength={4}
                onChange={(event) => updateField('year', event.target.value)}
              />
              {renderError('year') ?? (
                <div className="form-hint">
                  {LIMITS.minYear} – {MAX_YEAR} arası
                </div>
              )}
            </div>

            <div className="col-12">
              <label className="form-label-custom" htmlFor={fieldId('creator')}>
                {getCreatorLabel(selectedType)} <span className="optional-mark">(opsiyonel)</span>
              </label>
              <input
                {...inputProps('creator')}
                type="text"
                className={`form-control-custom${invalidClass('creator')}`}
                placeholder={selectedType ? CREATOR_PLACEHOLDERS[selectedType] : ''}
                value={values.creator}
                onChange={(event) => updateField('creator', event.target.value)}
              />
              {renderError('creator')}
            </div>

            <div className="col-12">
              <span className="form-label-custom d-block" id={`${fieldId('rating')}-label`}>
                Puan <span className="optional-mark">(opsiyonel)</span>
              </span>
              <div role="group" aria-labelledby={`${fieldId('rating')}-label`}>
                <RatingInput
                  id={fieldId('rating')}
                  value={values.rating}
                  invalid={Boolean(errors.rating)}
                  describedBy={errors.rating ? errorId('rating') : undefined}
                  onChange={(rating) => updateField('rating', rating)}
                />
              </div>
              {renderError('rating')}
            </div>

            <div className="col-12">
              <label className="form-label-custom" htmlFor={fieldId('note')}>
                Not <span className="optional-mark">(opsiyonel)</span>
              </label>
              <textarea
                {...inputProps('note')}
                className={`form-control-custom${invalidClass('note')}`}
                rows={3}
                placeholder="Kısa bir yorum, kaldığın bölüm/sayfa, kimin önerdiği…"
                value={values.note}
                onChange={(event) => updateField('note', event.target.value)}
              />
              {renderError('note') ?? (
                <div className="form-hint text-end">
                  {values.note.trim().length} / {LIMITS.note}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-custom btn-custom-light" onClick={onCancel}>
            Vazgeç
          </button>
          <button type="submit" className="btn-custom btn-custom-primary">
            <i className={`bi ${isEdit ? 'bi-check2' : 'bi-plus-lg'}`} aria-hidden="true" />
            {isEdit ? 'Değişiklikleri Kaydet' : 'Ekle'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
