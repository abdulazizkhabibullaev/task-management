import { CommonException, ErrorCodes } from 'src/common/filter/common.error';

export class TaskError extends CommonException {
    static NotFound(data?: any) {
        return new CommonException(ErrorCodes.TASK, data);
    }

    static AlreadyExists(data?: any) {
        return new CommonException(ErrorCodes.TASK + 1, data);
    }
}
