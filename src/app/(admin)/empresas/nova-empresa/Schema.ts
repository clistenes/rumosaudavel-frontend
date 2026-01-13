import * as yup from 'yup'
import { EmpresaFormData } from './empresaFormData';

export const empresaSchema: yup.ObjectSchema<EmpresaFormData> = yup
.object({
  empresa: yup.string().required('O nome da empresa é obrigatório'),
  introducao: yup.string().required('A introdução é obrigatória'),
  cor: yup.string().required('A cor é obrigatória'),
  termo: yup.boolean().required('Você deve aceitar os termos'),
  logotipo: yup.mixed<FileList>().required('O logotipo é obrigatório'),
  
})
.required();