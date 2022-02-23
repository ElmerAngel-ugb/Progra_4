Vue.component('v-select-cliente',VueSelect.VueSelect);
Vue.component('lectura',{
    data:()=>{
        return {
            buscar:'',
            lecturas:[],
            clientes:[],
            lectura:{
                accion : 'nuevo',
                mostrar_msg : false,
                msg : '',
                cliente: {
                    id: '',
                    label: '',
                },
                idLectura : '',
                fecha: '',
                lanterior : '',
                lactual : '',
                pago : '0',
            }
        }
    },
    methods:{    
        buscandoLectura(){
            this.obtenerLecturas(this.buscar);
        },
        eliminarLectura(lectura){
            if( confirm(`Esta seguro de eliminar el lectura ${lectura.nombre}?`) ){
                this.lectura.accion = 'eliminar';
                this.lectura.idLectura = lectura.idLectura;
                this.guardarLectura();
            }
            this.nuevoLectura();
        },
        modificarLectura(datos){
            this.lectura = JSON.parse(JSON.stringify(datos));
            this.lectura.accion = 'modificar';
        },
        guardarLectura(){
            this.obtenerLecturas();
            let lecturas = JSON.parse(localStorage.getItem('lecturas')) || [];
            if(this.lectura.accion=="nuevo"){
                this.lectura.idLectura = generarIdUnicoFecha();
                lecturas.push(this.lectura);
            } else if(this.lectura.accion=="modificar"){
                let index = lecturas.findIndex(lectura=>lectura.idLectura==this.lectura.idLectura);
                lecturas[index] = this.lectura;
            } else if( this.lectura.accion=="eliminar" ){
                let index = lecturas.findIndex(lectura=>lectura.idLectura==this.lectura.idLectura);
                lecturas.splice(index,1);
            }
            localStorage.setItem('lecturas', JSON.stringify(lecturas));
            this.nuevoLectura();
            this.obtenerLecturas();
            this.lectura.msg = 'lectura procesado con exito';
        },
        obtenerLecturas(valor=''){
            this.lecturas = [];
            let lecturas = JSON.parse(localStorage.getItem('lecturas')) || [];
            this.lecturas = lecturas.filter(lectura=>lectura.nombre.toLowerCase().indexOf(valor.toLowerCase())>-1);

            this.clientes = [];
            let clientes = JSON.parse(localStorage.getItem('clientes')) || [];
            this.clientes = clientes.map(cliente=>{
                return {
                    id: cliente.idCliente,
                    label: cliente.nombre,
                }
            });
        },
        nuevoLectura(){
            this.lectura.accion = 'nuevo';
            this.lectura.msg = '';
            this.lectura.idLectura = '';
            this.lectura.fecha = '';
            this.lectura.lanterior = '';
            this.lectura.lactual = '';
            this.lectura.pago = '';
        }
        
    },
    created(){
        this.obtenerLecturas();
    },
    template:`
        <div id="appCiente">
            <div class="card text-white" id="carlectura">
                <div class="card-header bg-primary">
                    Registro de lecturas
                    <button type="button" class="btn-close text-end" data-bs-dismiss="alert" data-bs-target="#carlectura" aria-label="Close"></button>
                </div>
                <div class="card-body text-dark">
                    <form method="post" @submit.prevent="guardarlectura" @reset="nuevolectura">
                        <div class="row p-1">
                            <div class="col col-md-2">
                                Cliente:
                            </div>
                            <div class="col col-md-3">
                                <v-select-cliente v-model="lectura.cliente" 
                                    :options="clientes" placeholder="Seleccione una cliente"/>
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">Fecha:</div>
                            <div class="col col-md-2">
                                <input title="Ingrese la Fecha" v-model="lectura.fecha" pattern="[0-9]{2}/[0-9]{2}/[0-9]{4}" required type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">Metro consumido inicial:</div>
                            <div class="col col-md-3">
                                <input title="Ingrese los metros consumidos, inicial" v-model="lectura.lanterior" required type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">Metro Consumido final:</div>
                            <div class="col col-md-3">
                                <input title="Ingrese los metros consumidos, final" v-model="lectura.lactual" required type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">Total:</div>
                            <div class="col col-md-3">
                                <input title="Total" v-model="lectura.pago" pattern="[0-9.]{1,10}" required type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-5 text-center">
                                <div v-if="lectura.mostrar_msg" class="alert alert-primary alert-dismissible fade show" role="alert">
                                    {{ lectura.msg }}
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
            <div class="card text-white" id="carBuscarlectura">
                <div class="card-header bg-primary">
                    Busqueda de lecturas
                    <button type="button" class="btn-close" data-bs-dismiss="alert" data-bs-target="#carBuscarlectura" aria-label="Close"></button>
                </div>
                <div class="card-body">
                    <table class="table table-dark table-hover">
                        <thead>
                            <tr>
                                <th colspan="6">
                                    Buscar: <input @keyup="buscandolectura" v-model="buscar" placeholder="buscar aqui" class="form-control" type="text" >
                                </th>
                            </tr>
                            <tr>
                                <th>CLIENTE</th>
                                <th>FECHA</th>
                                <th>M-INICIAL</th>
                                <th>M-FINAL</th>
                                <th>TOTAL A PAGAR</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in lecturas" @click='modificarlectura( item )' :key="item.idlectura">
                                <td>{{item.cliente}}</td>
                                <td>{{item.fecha}}</td>
                                <td>{{item.lanterior}}</td>
                                <td>{{item.lactual}}</td>
                                <td>{{item.pago}}</td>
                                <td>
                                    <button class="btn btn-danger" @click="eliminarlectura(item)">Eliminar</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `
});