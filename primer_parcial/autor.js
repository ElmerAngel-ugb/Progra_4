Vue.component('autor',{
    data:()=>{
        return {
            buscar:'',
            autors:[],
            autor:{
                accion : 'nuevo',
                mostrar_msg : false,
                msg : '',
                idautor : '',
                codigo: '',
                nombre: '',
                pais: '',
                telefono: ''
            }
        }
    },
    methods:{
        buscandoautor(){
            this.obtenerautors(this.buscar);
        },
        eliminarautor(autor){
            if( confirm(`Esta seguro de eliminar el autor ${autor.nombre}?`) ){
                this.autor.accion = 'eliminar';
                this.autor.idautor = autor.idautor;
                this.guardarautor();
            }
            this.nuevoautor();
        },
        modificarautor(datos){
            this.autor = JSON.parse(JSON.stringify(datos));
            this.autor.accion = 'modificar';
        },
        guardarautor(){
            this.obtenerautors();
            let autors = JSON.parse(localStorage.getItem('autors')) || [];
            if(this.autor.accion=="nuevo"){
                this.autor.idautor = generarIdUnicoFecha();
                autors.push(this.autor);
            } else if(this.autor.accion=="modificar"){
                let index = autors.findIndex(autor=>autor.idautor==this.autor.idautor);
                autors[index] = this.autor;
            } else if( this.autor.accion=="eliminar" ){
                let index = autors.findIndex(autor=>autor.idautor==this.autor.idautor);
                autors.splice(index,1);
            }
            localStorage.setItem('autors', JSON.stringify(autors));
            this.nuevoautor();
            this.obtenerautors();
            this.autor.msg = 'autor procesado con exito';
        },
        obtenerautors(valor=''){
            this.autors = [];
            let autors = JSON.parse(localStorage.getItem('autors')) || [];
            this.autors = autors.filter(autor=>autor.nombre.toLowerCase().indexOf(valor.toLowerCase())>-1);
        },
        nuevoautor(){
            this.autor.accion = 'nuevo';
            this.autor.msg = '';
            this.autor.idautor = '';
            this.autor.codigo = '';
            this.autor.nombre = '';
            this.autor.pais = '';
            this.autor.telefono = '';
        }
    },
    created(){
        this.obtenerautors();
    },
    template:`
        <div id="appParcial">
            <div class="card text-white" id="carautor">
                <div class="card-header bg-primary">
                    Registro de autores
                    <button type="button" class="btn-close text-end" data-bs-dismiss="alert" data-bs-target="#carautor" aria-label="Close"></button>
                </div>
                <div class="card-body text-dark">
                    <form method="post" @submit.prevent="guardarautor" @reset="nuevoautor">
                        <div class="row p-1">
                            <div class="col col-md-2">Codigo:</div>
                            <div class="col col-md-2">
                                <input title="Ingrese el codigo" v-model="autor.codigo" pattern="[0-9]{3,10}" required type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">Nombre:</div>
                            <div class="col col-md-3">
                                <input title="Ingrese el nombre" v-model="autor.nombre" pattern="[A-Za-zñÑáéíóúü ]{3,75}" required type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">pais:</div>
                            <div class="col col-md-3">
                                <input title="Ingrese la pais" v-model="autor.pais" pattern="[A-Za-zñÑáéíóúü ]{3,100}" required type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">Telefono:</div>
                            <div class="col col-md-2">
                                <input title="Ingrese el tel" v-model="autor.telefono" pattern="[0-9]{4}-[0-9]{4}" required type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-5 text-center">
                                <div v-if="autor.mostrar_msg" class="alert alert-primary alert-dismissible fade show" role="alert">
                                    {{ autor.msg }}
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
            <div class="card text-white" id="carBuscarautor">
                <div class="card-header bg-primary">
                    Busqueda de autores
                    <button type="button" class="btn-close" data-bs-dismiss="alert" data-bs-target="#carBuscarautor" aria-label="Close"></button>
                </div>
                <div class="card-body">
                    <table class="table table-dark table-hover">
                        <thead>
                            <tr>
                                <th colspan="6">
                                    Buscar: <input @keyup="buscandoautor" v-model="buscar" placeholder="buscar aqui" class="form-control" type="text" >
                                </th>
                            </tr>
                            <tr>
                                <th>CODIGO</th>
                                <th>NOMBRE</th>
                                <th>pais</th>
                                <th>TEL</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in autors" @click='modificarautor( item )' :key="item.idautor">
                                <td>{{item.codigo}}</td>
                                <td>{{item.nombre}}</td>
                                <td>{{item.pais}}</td>
                                <td>{{item.telefono}}</td>
                                <td>
                                    <button class="btn btn-danger" @click="eliminarautor(item)">Eliminar</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `
});