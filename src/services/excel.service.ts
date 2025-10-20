import * as XLSX from 'xlsx';
import path from 'path';
import { Behavior, Comportamiento, Recognition, Reconocimiento, User, Usuario, Valor, Value } from '../types';
import { behaviorMapper, recognitionMapper, userMapper, valueMapper } from '../mappers';

class ExcelService {
    private workbook: XLSX.WorkBook | null = null;
    private excelPath: string;

    constructor() {
        this.excelPath = path.join(__dirname, '../../data/RECONOCIMIENTO.xlsx');
        this.loadWorkbook();
    }

    private loadWorkbook() {
        try {
            this.workbook = XLSX.readFile(this.excelPath);
            console.log('✅ Excel cargado correctamente');
        } catch (error) {
            console.error('❌ Error al cargar Excel:', error);
            throw new Error('No se pudo cargar el archivo Excel');
        }
    }

    private getSheet(sheetName: string): any[] {
        if (!this.workbook) {
            throw new Error('Workbook no cargado');
        }

        const sheet = this.workbook.Sheets[sheetName];
        if (!sheet) {
            throw new Error(`Hoja ${sheetName} no encontrada`);
        }

        return XLSX.utils.sheet_to_json(sheet);
    }

    async getUserById(userId: string): Promise<User | undefined> {
        const usuarios = this.getSheet('USUARIOS') as Usuario[];
        const user = usuarios.find((u: Usuario) => u.ID_USUARIO.toString() === userId)
        return user ? userMapper(user) : undefined;
    }

    async getUserByEmail(userEmail: string): Promise<User | undefined> {
        const usuarios = this.getSheet('USUARIOS') as Usuario[];
        const user = usuarios.find((u: Usuario) => u.CORREO === userEmail)
        return user ? userMapper(user) : undefined;
    }

    async searchUser(searchTerm: string, currentPage: number, pageSize: number): Promise<User[]> {
        const usuarios = this.getSheet('USUARIOS') as Usuario[];
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return usuarios.filter((u: Usuario) => u.NOMBRE.toLowerCase().includes(searchTerm.toLowerCase())).slice(startIndex, endIndex).map(userMapper);
    }

    async getValues(): Promise<Value[]> {
        return this.getSheet('VALORES').map(valueMapper);
    }

    async getBehaviors(): Promise<Behavior[]> {
        const comportamientos = this.getSheet('COMPORTAMIENTOS') as Comportamiento[];
        console.log(comportamientos)
        return comportamientos.map(behaviorMapper);
    }

    async getBehaviorsByValue(idValor: number): Promise<Behavior[]> {
        const comportamientos = this.getSheet('COMPORTAMIENTOS') as Comportamiento[];
        return comportamientos.filter((c: Comportamiento) => c.ID_VALOR === idValor && c.FLAG_ACTIVO).map(behaviorMapper);
    }

    async getRecognitions(): Promise<Recognition[]> {
        return this.getSheet('RECONOCIMIENTOS').map(recognitionMapper);
    }

    async getAllUsers(): Promise<User[]> {
        return this.getSheet('USUARIOS').map(userMapper);
    }

    private getNextId(): number {
        try {
            const reconocimientos = this.getSheet('RECONOCIMIENTOS');

            if (reconocimientos.length === 0) {
                return 1;
            }

            const maxId = Math.max(...reconocimientos.map((r: Reconocimiento) => r.ID_RECONOCIMIENTO || 0));
            return maxId + 1;
        } catch (error) {
            return 1;
        }
    }

    async saveToExcel(recognition: Reconocimiento): Promise<void> {
        if (!this.workbook) {
            throw new Error('Workbook no cargado');
        }
        const sheet = this.workbook.Sheets['RECONOCIMIENTOS'] as XLSX.WorkSheet;
        const data = XLSX.utils.sheet_to_json(sheet);

        data.push(recognition);

        const newSheet = XLSX.utils.json_to_sheet(data);
        this.workbook.Sheets['RECONOCIMIENTOS'] = newSheet;

        XLSX.writeFile(this.workbook, this.excelPath);
        console.log('✅ Reconocimiento guardado en Excel');
    }

    async createRecognition(
        senderId: number,
        receiverId: number,
        behaviorId: number,
        message: string
    ): Promise<{ success: boolean; recognition?: Recognition; error?: string }> {
        try {
            const newRecognition: Reconocimiento = {
                ID_RECONOCIMIENTO: this.getNextId(),
                ID_USUARIO_ENVIA: senderId,
                ID_USUARIO_RECIBE: receiverId,
                ID_COMPORTAMIENTO: behaviorId,
                MENSAJE: message,
                FECHA_RECONOCIMIENTO: new Date().toISOString(),
                ESTADO_CORREO: "NO ENVIADO"
            };

            this.saveToExcel(newRecognition);
            this.reloadWorkbook();
            return {
                success: true,
                recognition: recognitionMapper(newRecognition)
            };
        } catch (error: any) {
            console.error('❌ Error al crear reconocimiento:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async updateRecognitionEmailStatus(recognitionId: number, status: string): Promise<void> {
        if (!this.workbook) {
            throw new Error('Workbook no cargado');
        }
        const sheet = this.workbook.Sheets['RECONOCIMIENTOS'] as XLSX.WorkSheet;
        const data = XLSX.utils.sheet_to_json(sheet) as Reconocimiento[];

        const recognition = data.find((r: Reconocimiento) => r.ID_RECONOCIMIENTO === recognitionId);
        if (!recognition) {
            throw new Error('Reconocimiento no encontrado');
        }

        recognition.ESTADO_CORREO = status;

        const newSheet = XLSX.utils.json_to_sheet(data);
        this.workbook.Sheets['RECONOCIMIENTOS'] = newSheet;

        XLSX.writeFile(this.workbook, this.excelPath);
        console.log('✅ Estado del correo actualizado en Excel');
    }

    reloadWorkbook() {
        this.loadWorkbook();
    }
}

export const excelService = new ExcelService();