// Servicio para integración con RENIEC
export interface ReniecData {
  dni: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fechaNacimiento: string;
  sexo: 'M' | 'F';
  estadoCivil: string;
  ubigeo: string;
  direccion: string;
}

export interface ParentescoData {
  dni: string;
  nombres: string;
  apellidos: string;
  parentesco: string;
  esTutor: boolean;
}

class ReniecService {
  private baseUrl = 'https://api.apis.net.pe/v2/reniec/dni';
  private token = process.env.RENIEC_TOKEN || 'YOUR_TOKEN_HERE'; // Token de la API

  async consultarDNI(dni: string): Promise<ReniecData | null> {
    try {
      // Primero intentar con la API real
      try {
        const response = await fetch(`${this.baseUrl}?numero=${dni}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${this.token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          
          // Mapear la respuesta de la API real al formato esperado
          return {
            dni: data.numeroDocumento || dni,
            nombres: data.nombres || '',
            apellidoPaterno: data.apellidoPaterno || '',
            apellidoMaterno: data.apellidoMaterno || '',
            fechaNacimiento: data.fechaNacimiento || '',
            sexo: data.sexo === 'MASCULINO' ? 'M' : 'F',
            estadoCivil: data.estadoCivil || '',
            ubigeo: data.ubigeo || '',
            direccion: data.direccion || ''
          };
        }
      } catch (apiError) {
        console.log('API real no disponible, usando datos simulados');
      }

      // Fallback a datos simulados para demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData: { [key: string]: ReniecData } = {
        '12345678': {
          dni: '12345678',
          nombres: 'MARIA ELENA',
          apellidoPaterno: 'GONZALEZ',
          apellidoMaterno: 'PEREZ',
          fechaNacimiento: '1990-05-15',
          sexo: 'F',
          estadoCivil: 'SOLTERO',
          ubigeo: '150101',
          direccion: 'AV LIMA 123 LIMA LIMA'
        },
        '87654321': {
          dni: '87654321',
          nombres: 'CARLOS ALBERTO',
          apellidoPaterno: 'MENDOZA',
          apellidoMaterno: 'SILVA',
          fechaNacimiento: '1985-08-22',
          sexo: 'M',
          estadoCivil: 'CASADO',
          ubigeo: '150101',
          direccion: 'JR AREQUIPA 456 LIMA LIMA'
        },
        '11223344': {
          dni: '11223344',
          nombres: 'ANA LUCIA',
          apellidoPaterno: 'RODRIGUEZ',
          apellidoMaterno: 'LOPEZ',
          fechaNacimiento: '2010-03-10',
          sexo: 'F',
          estadoCivil: 'SOLTERO',
          ubigeo: '150101',
          direccion: 'AV BRASIL 789 LIMA LIMA'
        },
        '46027897': {
          dni: '46027897',
          nombres: 'JUAN CARLOS',
          apellidoPaterno: 'VARGAS',
          apellidoMaterno: 'TORRES',
          fechaNacimiento: '1988-12-03',
          sexo: 'M',
          estadoCivil: 'SOLTERO',
          ubigeo: '150101',
          direccion: 'AV UNIVERSITARIA 1801 LIMA LIMA'
        }
      };

      return mockData[dni] || null;
    } catch (error) {
      console.error('Error consultando RENIEC:', error);
      return null;
    }
  }

  async verificarParentesco(dniMenor: string, dniAdulto: string): Promise<ParentescoData | null> {
    try {
      // Simulación de verificación de parentesco
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Datos simulados para demo
      const mockParentesco: { [key: string]: ParentescoData } = {
        '11223344_87654321': {
          dni: '87654321',
          nombres: 'CARLOS ALBERTO',
          apellidos: 'MENDOZA SILVA',
          parentesco: 'PADRE',
          esTutor: true
        }
      };

      const key = `${dniMenor}_${dniAdulto}`;
      return mockParentesco[key] || null;
    } catch (error) {
      console.error('Error verificando parentesco:', error);
      return null;
    }
  }

  calcularEdad(fechaNacimiento: string): number {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    
    return edad;
  }
}

export const reniecService = new ReniecService();