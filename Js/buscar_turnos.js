document.addEventListener('DOMContentLoaded', () => {
    const especialidadSelect = document.getElementById('especialidad');
    const profesionalSelect = document.getElementById('profesional');
    const horarioSelect = document.getElementById('horario');
    const sedeSelect = document.getElementById('sede');
    const idProfesionalInput = document.getElementById('id_profesional');
    const idSedeInput = document.getElementById('id_sede');
    const idUsuarioInput = document.getElementById('id_usuario');
    const form = document.getElementById('formularioTurnos');

    especialidadSelect.addEventListener('change', async () => {
        const selectedEspecialidad = especialidadSelect.value;
        console.log('Especialidad seleccionada:', selectedEspecialidad);

        if (selectedEspecialidad) {
            await cargarProfesionales(selectedEspecialidad);
            profesionalSelect.disabled = false;
            horarioSelect.disabled = true;
        } else {
            profesionalSelect.disabled = true;
            horarioSelect.disabled = true;
        }
    });

    profesionalSelect.addEventListener('change', async () => {
        const selectedProfesional = profesionalSelect.value;
        const selectedEspecialidad = especialidadSelect.value;
        console.log('Profesional seleccionado:', selectedProfesional);

        if (selectedProfesional) {
            idProfesionalInput.value = selectedProfesional;
            await cargarHorarios(selectedEspecialidad);
            horarioSelect.disabled = false;
        } else {
            horarioSelect.disabled = true;
        }
    });

    sedeSelect.addEventListener('change', () => {
        const selectedSede = sedeSelect.value;
        idSedeInput.value = selectedSede;
    });

    async function cargarEspecialidades() {
        try {
            const response = await fetch('http://127.0.0.1:5000/api/especialidades');
            const data = await response.json();
            especialidadSelect.innerHTML = '<option value="">Selecciona una especialidad</option>';
            data.forEach(especialidad => {
                const option = document.createElement('option');
                option.textContent = especialidad;
                option.value = especialidad;
                especialidadSelect.appendChild(option);
            });
            especialidadSelect.disabled = false;
        } catch (error) {
            console.error('Error al cargar especialidades:', error);
        }
    }

    async function cargarProfesionales(especialidad) {
        try {
            const response = await fetch(`http://127.0.0.1:5000/api/profesionales/${encodeURIComponent(especialidad)}`);
            const data = await response.json();
            profesionalSelect.innerHTML = '<option value="">Selecciona un profesional</option>';
            data.forEach(profesional => {
                const option = document.createElement('option');
                option.textContent = profesional.nombre;
                option.value = profesional.id;
                profesionalSelect.appendChild(option);
            });
            if (data.length === 0) {
                profesionalSelect.disabled = true;
            }
        } catch (error) {
            console.error('Error al cargar profesionales:', error);
        }
    }

    async function cargarHorarios(especialidad) {
        try {
            const response = await fetch(`http://127.0.0.1:5000/api/horarios/${encodeURIComponent(especialidad)}`);
            const data = await response.json();
            horarioSelect.innerHTML = '<option value="">Selecciona un horario</option>';
            data.forEach(horario => {
                const option = document.createElement('option');
                option.textContent = horario.horario;
                option.value = horario.id;
                horarioSelect.appendChild(option);
            });
            if (data.length === 0) {
                horarioSelect.disabled = true;
            }
        } catch (error) {
            console.error('Error al cargar horarios:', error);
        }
    }

    async function cargarSedes() {
        try {
            const response = await fetch('http://127.0.0.1:5000/api/sedes');
            const data = await response.json();
            sedeSelect.innerHTML = '<option value="">Selecciona una sede</option>';
            data.forEach(sede => {
                const option = document.createElement('option');
                option.textContent = sede.nombre;
                option.value = sede.id;
                sedeSelect.appendChild(option);
            });
            sedeSelect.disabled = false;
        } catch (error) {
            console.error('Error al cargar sedes:', error);
        }
    }

    cargarEspecialidades();
    cargarSedes();

    form.addEventListener('submit', async event => {
        event.preventDefault();

        const idProfesional = idProfesionalInput.value;
        const idSede = idSedeInput.value;
        const idUsuario = idUsuarioInput.value;

        if (idProfesional && idSede && idUsuario) {
            await guardarTurno(idProfesional, idSede, idUsuario);
        } else {
            console.error('Faltan campos por completar.');
        }
    });

    async function guardarTurno(idProfesional, idSede, idUsuario) {
        try {
            const formData = new FormData();
            formData.append('id_profesional', idProfesional);
            formData.append('id_sede', idSede);
            formData.append('id_usuario', idUsuario);

            const response = await fetch('http://127.0.0.1:5000/api/guardar_turno', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            console.log('Turno guardado:', data);
        } catch (error) {
            console.error('Error al guardar el turno:', error);
        }
    }
});
