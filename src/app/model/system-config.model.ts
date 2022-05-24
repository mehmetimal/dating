export interface IGeneralConfig {
    isMaintenance?: boolean;
    isNews?: boolean;
    isEmailSend?: boolean;
    sliderTimer?: number;
    isSurveyActive?: boolean;
    isFacebookLoginActive?: boolean;
    isGameActive?: boolean;
    isWelcomePageHeaderBoxShow?: boolean;
}

export class GeneralConfig implements IGeneralConfig {
    constructor(
        public isMaintenance?: boolean,
        public isNews?: boolean,
        public sliderTimer?: number,
        public isSurveyActive?: boolean,
        public isFacebookLoginActive?: boolean,
        public isGameActive?: boolean,
        public isWelcomePageHeaderBoxShow?: boolean,
    ) {
    }
}
