import request from '../utils/examRequest';

/**
 * 考试发布
 * @param {*} addFormData 
 */
export const addPublishRecord = (addFormData) => {
    return request({
        url: '/publish/addPublishRecord',
        method: 'post',
        data: addFormData
    })
}
/**
 * 删除考试发布记录
 * @param {*} deletePublishRecord 
 */
export const deletePublishRecord = (deletePublishRecord) => {
    return request({
        url: '/publish/deletePublishRecord',
        method: 'delete',
        data: deletePublishRecord
    })
}
/**
 * 修改考试发布记录
 * @param {*} updatePublishRecord 
 */
export const updatePublishRecord = (updatePublishRecord) => {
    return request({
        url: '/publish/updatePublishRecord',
        method: 'put',
        data: updatePublishRecord
    })
}

/**
 * 查询考试发布记录
 * @param {*} queryPublishRecord 
 */
export const queryPublishRecord = (queryPublishRecord) => {
    return request({
        url: '/publish/queryPublishRecord',
        method: 'get',
        data: queryPublishRecord
    })
}
/**
 * 查看二维码信息
 * @param {*} showQRCode 
 */
export const showQRCode = (showQRCode) => {
    return request({
        url: '/publish/showQRCode',
        method: 'get',
        data: showQRCode
    })
}
/**
 * 手机开始答卷
 * @param {*} startTest 
 */
export const startTest = (startTest) => {
    return request({
        url: '/answer/startTest',
        method: 'post',
        data: startTest
    })
}
/**
 * 答案记录返回
 * @param {*} backAnswer 
 */
export const backAnswer = (backAnswer) => {
    return request({
        url: '/answer/backAnswer',
        method: 'get',
        data: backAnswer
    })
}
/**
 * 提交试卷
 * @param {*} submitTestPaper 
 */
export const submitTestPaper = (submitTestPaper) => {
    return request({
        url: '/answer/submitTestPaper',
        method: 'put',
        data: submitTestPaper
    })
}

/**
 * 查询试卷明细
 * @param {*} queryRecord 
 */
export const queryRecord = (queryRecord) => {
    return request({
        url: '/answer/queryRecord',
        method: 'get',
        data: queryRecord
    })
}

/**
 * 定时提交考试记录
 * @param {*} submitTestForTimer 
 */
export const submitTestForTimer = (submitTestForTimer) => {
    return request({
        url: '/answer/submitTestForTimer',
        method: 'post',
        data: submitTestForTimer
    })
}

/**
 * 查询考试记录
 * @param {*} queryRecord 
 */
export const queryMarkingRecord = (queryRecord) => {
    return request({
        url: '/marking/queryRecord',
        method: 'get',
        data: queryRecord
    })
}

/**
 * 查询考试记录明细
 * @param {*} queryExamRecordDetail 
 */
export const queryExamRecordDetail = (queryExamRecordDetail) => {
    return request({
        url: '/marking/queryExamRecordDetail',
        method: 'get',
        data: queryExamRecordDetail
    })
}
/**
 * 评卷结果提交
 * @param {*} evaluate 
 */
export const evaluate = (evaluate) => {
    return request({
        url: '/marking/evaluate',
        method: 'put',
        data: evaluate
    })
}
/**
 *  考试报表查询
 * @param {*} queryExamRecord 
 */
export const queryExamRecord = (queryExamRecord) => {
    return request({
        url: '/report/queryExamRecord',
        method: 'get',
        data: queryExamRecord
    })
}

/**
 *  考试报表明细查询
 * @param {*} queryExamRecord 
 */
export const queryExamRecordDetail2 = (queryExamRecord) => {
    return request({
        url: '/report/queryExamRecordDetail',
        method: 'get',
        data: queryExamRecord
    })
}