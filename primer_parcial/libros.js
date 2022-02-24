Vue.component('libros', {
    data:()=>{
        return {
            libros: [],
            buscar: '',
            libros: {
                accion: 'nuevo',
                msg : '',
                idLibros: '',
                codigo: '',
                nombre: ''
            }
        }
    },
    methods: {
        buscarLibros(){
            this.obtenerDatos(this.buscar);
        },
        guardarLibro(){
            this.obtenerDatos();
            let libros = this.libros || [];
            if(this.libros.accion == 'nuevo'){
                this.libros.idLibros = idUnicoFecha();
                libros.push(this.libros);
            }else if(this.libros.accion == 'modificar'){
                let index = libros.findIndex(libros=>libros.idLibros==this.libros.idLibros);
                libros[index] = this.libros;
            }else if(this.libros.accion == 'eliminar'){
                let index = libros.findIndex(libros=>libros.idLibros==this.libros.idLibros);
                libros.splice(index,1);
            }
            localStorage.setItem('libros', JSON.stringify(this.libros));
            this.libros.msg = 'Libro procesado con exito';
            this.nuevoLibro();
            this.obtenerDatos();
        },
        modificarLibro(data){
            this.libros = JSON.parse(JSON.stringify(data));
            this.libros.accion = 'modificar';
        },
        eliminarLibro(data){
            if( confirm(`¿Esta seguro de eliminar el libro? ${data.nombre}?`) ){
                this.libros.idLibros = data.idLibros;
                this.libros.accion = 'eliminar';
                this.guardarlibro();
            }
        },
        obtenerDatos(busqueda=''){
            this.libros = [];
            if( localStorage.getItem('libros')!=null ){
                for(let i=0; i<JSON.parse(localStorage.getItem('libros')).length; i++){
                    let data = JSON.parse(localStorage.getItem('libros'))[i];
                    if( this.buscar.length>0 ){
                        if( data.nombre.toLowerCase().indexOf(this.buscar.toLowerCase())>-1 ){
                            this.libros.push(data);
                        }
                    }else{
                        this.libros.push(data);
                    }
                }
            }
        },
        nuevoLibro(){
            this.libros.accion = 'nuevo';
            this.libros.idLibros = '';
            this.libros.codigo = '';
            this.libros.nombre = '';
            this.libros.msg = '';
            console.log(this.libros);
        }
    }, 
    created(){
        this.obtenerDatos();
    },
    template: `
        <div id='appAutor'>
            <form @submit.prevent="guardarLibro" @reset.prevent="nuevoLibro" method="post" id="frmlibros">
                <div class="card mb-3">
                    <div class="card-header text-white bg-dark">
                        Administracion de Libros
                        <button type="button" class="btn-close bg-white" data-bs-dismiss="alert" data-bs-target="#frmlibros" aria-label="Close"></button>
                    </div>
                    <div class="card-body">
                        <div class="row p-1">
                            <div class="col col-md-1">Codigo</div>
                            <div class="col col-md-2">
                                <input v-model="Libros.codigo" placeholder="codigo" pattern="[A-Z0-9]{3,10}" required title="Codigo de libro" class="form-control" type="text">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-1">Nombre</div>
                            <div class="col col-md-2">
                                <input v-model="libros.nombre" placeholder="escribe tu nombre" pattern="[A-Za-zÑñáéíóú ]{3,75}" required title="Nombre de libros" class="form-control" type="text">
                            </div>
                        </div>
                        <div class="row">
                            <div class="col col-md-3 text-center">
                                <div class="alert alert-warning alert-dismissible fade show" role="alert">
                                    {{ libros.msg }}
                                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col col-md-3 text-center">
                                <button type="submit" class="btn btn-primary">Guardar</button>
                                <button type="reset" class="btn btn-warning">Nuevo</button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            <div class="card mb-3" id="cardBuscarLibro">
                <div class="card-header text-white bg-dark">
                    Busqueda de Libros
                    <button type="button" class="btn-close bg-white" data-bs-dismiss="alert" data-bs-target="#cardBuscarLibro" aria-label="Close"></button>
                </div>
                <div class="card-body">
                    <table class="table">
                        <thead>
                            <tr>
                                <td colspan="6">
                                    Buscar: <input title="Introduzca el nombre del libro a buscar" @keyup="buscarLibros" v-model="buscar" class="form-control" type="text">
                                </td>
                            </tr>
                            <tr>
                                <th>Codigo</th>
                                <th>Nombre</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in libros" :key="item.idLibros" @click="modificarLibros(item)">
                                <td>{{item.codigo}}</td>
                                <td>{{item.nombre}}</td>
                                <td>
                                    <button type="button" class="btn btn-danger" @click="eliminarLibro(item)">Eliminar</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div> 
    `
});