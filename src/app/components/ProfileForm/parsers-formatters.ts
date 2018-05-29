export const emailFormatter = (emails: Array<{ primary: boolean; value: string }>) => {
    if (emails == null) {
        return '';
    }
    const email = emails.find(email => email.primary) || emails[0];
    return email ? email.value : '';
};

export const emailParser = (email: string) => {
    return [{ primary: true, value: email }];
};
