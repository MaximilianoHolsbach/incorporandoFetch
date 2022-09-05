// ZONA DE CONSTANTES Y VARIABLES //

const botonLight = document.getElementById("botonLight")
const botonDark = document.getElementById("botonDark")
let darkMode
const divContenidos = document.getElementById("divContenidos")
const arraycontenidos = JSON.parse(localStorage.getItem('datos'))??[]//Consulto o genero el array para el localstorage, segun se precise 

const contenidosApi = (async()=>{//Llamada a la API
    try{//Tratamiento de mensajes de error
        const bajarContenido = await fetch('https://api.themoviedb.org/3/movie/popular?api_key=466c8b36609873d1f5365d3d45cca1bd&language=es-mx')
        if(bajarContenido.status === 200){
            const contenidosdesc = await bajarContenido.json()
            const datos = contenidosdesc.results
            localStorage.setItem('datos',JSON.stringify(datos))// Asigno los valores al key 'datos' del localStorage
        }else if(bajarContenido.status === 401){
            Swal.fire({//Librerias de alertas
                icon: 'warning',
                title: 'Oops...',
                text: 'ERROR DE ACTIVACION',
              }) 
        }else{
            Swal.fire({
                icon: 'warning',
                title: 'Oops...',
                text: 'ERROR DESCONOCIDO',
              }) 
        }
    }catch(error){
        console.log(error)
    }
})

// ZONA DARKMODE //

(localStorage.getItem('darkMode')) ? darkMode = localStorage.getItem('darkMode') : localStorage.setItem('darkMode', 'light')// Consulta de la existencia de la key 'darkMode'

if (darkMode == 'dark'){
    document.body.classList.add('darkMode')
}

botonDark.addEventListener('click',()=>{
    document.body.classList.add('darkMode')
    localStorage.setItem('darkMode','dark')
})

botonLight.addEventListener('click',()=>{
    document.body.classList.remove('darkMode')
    localStorage.setItem('darkMode', 'light')
})

// ZONA DE INTERACCION DON EL DOM //

const mostrarContenidos = JSON.parse(localStorage.getItem('datos'))

divContenidos.innerHTML=""

mostrarContenidos.forEach((contenido,index) => {//Iteración para generar tarjetas
    divContenidos.innerHTML+=`
        <div class="card border-success mb-3" id="contenido${index}" style="max-width: 20rem;margin:5px;"><!--El elemento padre-->
            <div class="card-header"><h5>${contenido.title}<h5></div><!--Primer hijo-->
            <div class="card-body"><!--Segundo hijo-->
                <p><img src="https://image.tmdb.org/t/p/w500/${contenido.poster_path}"></p>
                <button class="btn btn-danger">ELIMINAR</button>
        </div>
    `
})
mostrarContenidos.forEach((contenido, index)=>{//Itero los contenidos
    const tarjetaContenido = document.getElementById(`contenido${index}`)//Llamo a cada tarjeta por su indice y lo asigno a una constante
    tarjetaContenido.children[1].addEventListener('click',()=>{//Evento para eliminar contenido
       Swal.fire({//Libreria para indicar con carteles lo que se realizara y consultar si esta seguro. 
        icon: 'warning',
        title: 'ATENCION!!!',
        showDenyButton: true,
        showCancelButton: true,
        html:`Vas a eliminar ${contenido.title} definitivamente`,
        confirmButtonText: 'Estas seguro?',
        denyButtonText: `No estoy seguro`,
        cancelButonText:'',
       }).then((result)=>{
        if(result.isConfirmed){
            tarjetaContenido.remove()
            mostrarContenidos.splice(index,1)
            localStorage.setItem('datos',JSON.stringify(mostrarContenidos))
            Swal.fire('Contenido eliminado!')
        }else if(result.isDenied){
            Swal.fire('Consulta antes de eliminar!')
        }
       })
    })
})
