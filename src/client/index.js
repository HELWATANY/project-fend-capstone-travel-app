// Import styles
import './styles/resets.scss'
import './styles/base.scss'
import './styles/header.scss'
import './styles/form.scss'
import './styles/footer.scss'

import { validateForm } from './js/validateForm'
import { handleSubmit } from './js/formHandler'
import { events } from './js/events';
import { serviceWorkers } from './js/serviceWorkers';

export {
  validateForm,
  handleSubmit,
  events,
  serviceWorkers
}
