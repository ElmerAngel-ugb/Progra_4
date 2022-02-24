Vue.component('libros',{
    data:()=>{
        return {
            buscar:'',
            libros:[],
            libro:{
                accion : 'nuevo',
                mostrar_msg : false,
                msg : '',
                idlibro : '',
                idautor : '',
                codigo: '',
                titulo: '',
                editorial: '',
                edicion: ''
            }
        }
    },
    methods:{
        buscandolibro(){
            this.obtenerlibros(this.buscar);
        },
        eliminarlibro(libro){
            if( confirm(`Esta seguro de eliminar el libro ${libro.titulo}?`) ){
                this.libro.accion = 'eliminar';
                this.libro.idlibro = libro.idlibro;
                this.guardarlibro();
            }
            this.nuevolibro();
        },
        modificarlibro(datos){
            this.libro = JSON.parse(JSON.stringify(datos));
            this.libro.accion = 'modificar';
        },
        guardarlibro(){
            this.obtenerlibros();
            let libros = JSON.parse(localStorage.getItem('libros')) || [];
            if(this.libro.accion=="nuevo"){
                this.libro.idlibro = generarIdUnicoFecha();
                libros.push(this.libro);
            } else if(this.libro.accion=="modificar"){
                let index = libros.findIndex(libro=>libro.idlibro==this.libro.idlibro);
                libros[index] = this.libro;
            } else if( this.libro.accion=="eliminar" ){
                let index = libros.findIndex(libro=>libro.idlibro==this.libro.idlibro);
                libros.splice(index,1);
            }
            localStorage.setItem('libros', JSON.stringify(libros));
            this.nuevolibro();
            this.obtenerlibros();
            this.libro.msg = 'libro procesado con exito';
        },
        obtenerlibros(valor=''){
            this.libros = [];
            let libros = JSON.parse(localStorage.getItem('libros')) || [];
            this.libros = libros.filter(libro=>libro.titulo.toLowerCase().indexOf(valor.toLowerCase())>-1);
        },
        nuevolibro(){
            this.libro.accion = 'nuevo';
            this.libro.msg = '';
            this.libro.idlibro = '';
            this.libro.idautor = '';
            this.libro.codigo = '';
            this.libro.titulo = '';
            this.libro.editorial = '';
            this.libro.edicion = '';
        }
    },
    created(){
        this.obtenerlibros();
    },
    template:`
        <div id="appParcial">
            <div class="card text-white" id="carlibro">
                <div class="card-header bg-primary">
                    Registro de libros
                    <button type="button" class="btn-close text-end" data-bs-dismiss="alert" data-bs-target="#carlibro" aria-label="Close"></button>
                </div>
                <div class="card-body text-dark">
                    <form method="post" @submit.prevent="guardarlibro" @reset="nuevolibro">
                        <div class="row p-1">
                            <div class="col col-md-2">Autor:</div>
                            <div class="col col-md-2">
                                <input title="Ingrese el codigo" v-model="libro.idautor" pattern="[0-9]{3,10}" required type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">Codigo:</div>
                            <div class="col col-md-2">
                                <input title="Ingrese el codigo" v-model="libro.codigo" pattern="[0-9]{3,10}" required type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">titulo:</div>
                            <div class="col col-md-3">
                                <input title="Ingrese el titulo" v-model="libro.titulo" pattern="[A-Za-zñÑáéíóúü ]{3,75}" required type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">editorial:</div>
                            <div class="col col-md-3">
                                <input title="Ingrese la editorial" v-model="libro.editorial" pattern="[A-Za-zñÑáéíóúü ]{3,100}" required type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">edicion:</div>
                            <div class="col col-md-2">
                                <input title="Ingrese el tel" v-model="libro.edicion" pattern="[0-9]{3}" required type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-5 text-center">
                                <div v-if="libro.mostrar_msg" class="alert alert-primary alert-dismissible fade show" role="alert">
                                    {{ libro.msg }}
                                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                </div>
                            </div>
                        </div>
                        <div class="row m-2">
                            <div class="col col-md-5 text-center">
                                <input class="btn btn-success" type="submit" value="Guardar">
                                <input class="btn btn-warning" type="reset" value="Nuevo">
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="card text-white" id="carBuscarlibro">
                <div class="card-header bg-primary">
                    Busqueda de libros
                    <button type="button" class="btn-close" data-bs-dismiss="alert" data-bs-target="#carBuscarlibro" aria-label="Close"></button>
                </div>
                <div class="card-body">
                    <table class="table table-dark table-hover">
                        <thead>
                            <tr>
                                <th colspan="6">
                                    Buscar: <input @keyup="buscandolibro" v-model="buscar" placeholder="buscar aqui" class="form-control" type="text" >
                                </th>
                            </tr>
                            <tr>
                                <th>AUTOR</th>
                                <th>CODIGO</th>
                                <th>titulo</th>
                                <th>editorial</th>
                                <th>Edicion</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in libros" @click='modificarlibro( item )' :key="item.idlibro">
                                <td>{{item.idautor}}</td>
                                <td>{{item.codigo}}</td>
                                <td>{{item.titulo}}</td>
                                <td>{{item.editorial}}</td>
                                <td>{{item.edicion}}</td>
                                <td>
                                    <button class="btn btn-danger" @click="eliminarlibro(item)">Eliminar</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `
});