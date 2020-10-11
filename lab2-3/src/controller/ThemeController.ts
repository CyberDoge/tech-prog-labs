import Theme from "../model/Theme";
import SessionModel from "../session/SessionModel";
import PrimaryResponse from "../dto/PrimaryResponse";
import {NewThemeRequest} from "../dto/types/NewThemeRequest";
import {validateNewTheme} from "../validator/ThemeValidator";
import PrimaryRequest from "../dto/PrimaryRequest";
import {VoteToThemeRequest} from "../dto/types/VoteToThemeRequest";
import {SomeThemesRequest} from "../dto/types/SomeThemeRequest";
import {ThemeData} from "../dto/types/ThemeData";
import {getUserIdsWithThemeReadyForChat} from "../service/themeService/ThemeService";
import SessionStorage from "../storage/SessionStorage";

export function getSomeThemes(request: PrimaryRequest<SomeThemesRequest>, session: SessionModel): void {
    Theme.getSomeSortedByDateThemes(request.data.from, request.data.count || 0).then((themes) => {
        const themesRequest: Array<ThemeData> = themes.map(themeSchema => (
            {
                id: themeSchema._id,
                title: themeSchema.title,
                description: themeSchema.description
            }
        ));
        session.sendResponse(new PrimaryResponse({themes: themesRequest}, request.requestId))
    });
}

export function createTheme(request: PrimaryRequest<NewThemeRequest>, session: SessionModel) {
    if (!validateNewTheme(request.data)) {
        session.sendError(new Error("invalid theme fields"), request.requestId);
        return;
    }
    Theme.createTheme(request.data).then(() => {
        session.sendMessage("success", request.requestId)
    })
}

export function voteToTheme(request: PrimaryRequest<VoteToThemeRequest>, session: SessionModel, sessionStorage: SessionStorage) {
    Theme.voteToTheme(request.data.themeId, request.data.agree, session.userId!).then((theme) => {
        session.sendResponse(new PrimaryResponse({themeId: theme._id}, request.requestId));
        const userIds = getUserIdsWithThemeReadyForChat(theme, sessionStorage.isUserOnline);
        if (userIds.downUserId && userIds.upUserId) {
            sessionStorage.sendMessageUserWithId(userIds.downUserId, new PrimaryResponse(theme.id, "themeReady"))
            sessionStorage.sendMessageUserWithId(userIds.upUserId, new PrimaryResponse(theme.id, "themeReady"))
        }
    }).catch(reason => {
        session.sendError(reason, request.requestId);
    })
}