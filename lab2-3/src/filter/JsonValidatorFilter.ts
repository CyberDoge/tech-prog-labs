import SessionModel from "../session/SessionModel";
import {Filter} from "./Filter";
import PrimaryRequest from "../dto/PrimaryRequest";
import {IncorrectRequestJsonError} from "../error";
import {ROUTE_REQUEST_VALIDATION_TYPE_MAP} from "../const/RoutePathAndTypeConst";
import Ajv from 'ajv';
import ajv from 'ajv';

export class JsonValidatorFilter implements Filter {

    private ajv: ajv.Ajv;

    constructor() {
        this.ajv = new Ajv();
    }

    async doFilter(request: PrimaryRequest<any>, session?: SessionModel): Promise<void | never> {
        const schema = ROUTE_REQUEST_VALIDATION_TYPE_MAP.get(request.routePath);
        if (!schema) {
            throw new IncorrectRequestJsonError("Invalid route path");
        }
        const validate = this.ajv.compile(schema);
        if (!validate(request.data)) {
            throw new IncorrectRequestJsonError((
                validate.errors && validate.errors.map((error) => error.message).join(", ")
            ) || undefined);
        }
    }
}