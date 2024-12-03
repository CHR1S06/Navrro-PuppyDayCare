const appointments = JSON.parse(localStorage.getItem('appointments')) || []; // Cargar citas desde localStorage
const maxAppointments = 40;

// Referencias a los elementos del DOM
const form = document.getElementById('appointmentForm');
const petNameInput = document.getElementById('petName');
const dateInput = document.getElementById('date');
const timeInput = document.getElementById('time');
const extrasInput = document.getElementById('extras');
const appointmentsContainer = document.getElementById('appointments');

// Renderizar citas al cargar la página
renderAppointments();

// Evento para manejar el formulario
form.addEventListener('submit', function (e) {
  e.preventDefault();

  const petName = petNameInput.value.trim();
  const date = dateInput.value;
  const time = timeInput.value;
  const extras = extrasInput.value.trim();

  // Validaciones adicionales
  if (!isValidName(petName)) {
    alert('El nombre de la mascota debe tener entre 2 y 50 caracteres y solo contener letras.');
    return;
  }

  if (!isFutureDate(date)) {
    alert('La fecha debe ser hoy o una fecha futura.');
    return;
  }

  if (!isValidTime(time)) {
    alert('El horario debe estar dentro del horario laboral (08:00a.m - 06:00p.m).');
    return;
  }

  const dailyAppointments = appointments.filter(app => app.date === date);

  if (dailyAppointments.length >= maxAppointments) {
    alert('Cupo lleno para esta fecha. Por favor, selecciona otra.');
    return;
  }

  // Agregar la cita si pasa todas las validaciones
  appointments.push({ petName, date, time, extras });
  localStorage.setItem('appointments', JSON.stringify(appointments)); // Guardar en localStorage
  alert('Cita agendada con éxito.');
  renderAppointments();
  form.reset(); // Limpia el formulario después de agendar
});

// Renderizar citas en el DOM
function renderAppointments() {
  appointmentsContainer.innerHTML = '<h2>Listado de Citas</h2>';

  if (appointments.length === 0) {
    appointmentsContainer.innerHTML += '<p>No hay citas registradas.</p>';
    return;
  }

  appointments.forEach((app, index) => {
    appointmentsContainer.innerHTML += `
      <div class="appointment">
        <p>
          <strong>${app.petName}</strong> - ${app.date} ${app.time} (${app.extras || 'Solo cuidado'})
        </p>
        <button class="edit" onclick="editAppointment(${index})">Editar</button>
        <button class="delete" onclick="deleteAppointment(${index})">Eliminar</button>
      </div>
    `;
  });
}

// Función para eliminar una cita
function deleteAppointment(index) {
  appointments.splice(index, 1); // Eliminar cita del array
  localStorage.setItem('appointments', JSON.stringify(appointments)); // Actualizar localStorage
  renderAppointments(); // Volver a renderizar citas

  // Mostrar la alerta de eliminación exitosa
  alert('La cita ha sido eliminada satisfactoriamente.');
}

// Función para editar una cita
function editAppointment(index) {
  const appointment = appointments[index];
  
  // Prellena el formulario con los datos de la cita seleccionada
  petNameInput.value = appointment.petName;
  dateInput.value = appointment.date;
  timeInput.value = appointment.time;
  extrasInput.value = appointment.extras;

  // Eliminar la cita original antes de editar
  deleteAppointment(index);

  // Cambiar el texto del botón de envío a "Actualizar"
  const submitButton = form.querySelector('button');
  submitButton.textContent = 'Actualizar Cita';
  
  // Cambiar el evento del formulario para actualizar la cita
  form.addEventListener('submit', function updateAppointment(e) {
    e.preventDefault();

    // Actualizar la cita con los nuevos datos
    appointment.petName = petNameInput.value.trim();
    appointment.date = dateInput.value;
    appointment.time = timeInput.value;
    appointment.extras = extrasInput.value.trim();

    appointments.push(appointment); // Volver a agregarla al array
    localStorage.setItem('appointments', JSON.stringify(appointments)); // Guardar cambios en localStorage
    alert('Cita actualizada con éxito.');
    renderAppointments();

    // Resetear el formulario y cambiar el texto del botón a "Agendar"
    form.reset();
    submitButton.textContent = 'Agendar';
    form.removeEventListener('submit', updateAppointment); // Remover el evento de actualización
  });
}

// Función para validar el nombre de la mascota
function isValidName(name) {
  const nameRegex = /^[a-zA-Z\s]{2,50}$/;
  return nameRegex.test(name);
}

// Función para verificar si la fecha es válida (hoy o futura)
function isFutureDate(date) {
  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Ignorar la hora para comparar solo fechas
  return selectedDate >= today;
}

// Función para validar el horario laboral (08:00a.m - 06:00p.m)
function isValidTime(time) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours >= 8 && hours <= 18 && (hours < 18 || minutes === 0);
}
