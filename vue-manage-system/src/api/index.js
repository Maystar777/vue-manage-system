// import request from '../utils/request';
import { get, post, put, deletes } from '../utils/request'
export const fetchData = (query) => {
    return request({
        url: '/ms/table/list',
        method: 'post',
        data: query
    })
}



/*api接口统一管理 */

//---------------------数据字典api------------------------//
export const loadDictionaries=p=>get('/dictionary',p);
export const queryDictionary=p=>get('/dictionary',p);
export const addDictionary=p=>post('/dictionary',p);
export const deleteDictionaries=p=>deletes('/dictionary',p);
export const updateDictionary=p=>put('/dictionary',p);


//---------------------题目类别api-----------------------//

export const loadCategories=p=>get('/category',p);
export const addCategory=p=>post('/category',p);
export const deleteCategories=p=>deletes('/category',p);
export const updateCategory=p=>put('/category',p);
export const queryCategory=p=>get('/category',p);

//----------------------题型api------------------------//

export const loadSubjectTypes=p=>('/subjectType',p);
export const addSubjectType=p=>('/subjectType',p);
export const deleteSubjectTypes=p=>('/subjectType',p);
export const updateSubjectType=p=>('/subjectType',p);
export const querySubjectType=p=>('/subjectType',p);

//---------------------题目api-----------------------//

export const loadSubjects=p=>('/subject',p);
export const addSubject=p=>('/subject',p);
export const deleteSubjects=p=>('/subject',p);
export const updateSubject=p=>('/subject',p);
export const querySubject=p=>('/subject',p);

//---------------------组卷配置api-----------------------//

export const loadCombExams=p=>('/combExam',p);
export const addCombExam=p=>('/combExam',p);
export const deleteCombExams=p=>('/combExam',p);
export const updateCombExam=p=>('/combExam',p);
export const queryCombExam=p=>('/combExam',p);



