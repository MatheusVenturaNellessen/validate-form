class Register {
    constructor() {
        this.form = document.querySelector('.form');
        this.firstNameDiv = this.form.querySelector('#first-name-input-div');
        this.lastNameDiv = this.form.querySelector('#last-name-input-div');
        this.cpfDiv = this.form.querySelector('#cpf-input-div');
        this.userDiv = this.form.querySelector('#user-input-div');
        this.password1Div = this.form.querySelector('#password1-input-div');
        this.password2Div = this.form.querySelector('#password2-input-div');
        
        Object.defineProperties(this, {
            firstName: {
                enumerable: true,
                configurable: false,

                get: function() {
                    const firstName = this.form.querySelector('.first-name-input').value;
                    return  firstName.slice(0, firstName.indexOf(' '));
                }
            },
            lastName: {
                enumerable: true,
                configurable: false,
                
                get: () => this.form.querySelector('.last-name-input').value
            },
            cpf: {
                enumerable: false,
                configurable: false,
                
                get: function() {
                    const cpf = this.form.querySelector('.cpf-input').value;
                    return cpf.replace(/\D+/g, '');
                } 
            },
            user: {
                enumerable: true,
                configurable: false,
                
                get: () => this.form.querySelector('.user-input').value
            },
            password1: {
                enumerable: false,
                configurable: false,
                
                get: () => this.form.querySelector('.password1-input').value
            },
            password2: {
                enumerable: false,
                configurable: false,
                
                get: () => this.form.querySelector('.password2-input').value
            }
        });

        
        this.form.addEventListener('submit', event => {
            event.preventDefault();
            this.validateRegister();
        });

    }
   
    clearP() {
        const ps = this.form.querySelectorAll('p');
        
        for(let value of ps) {
            value.innerText = '';
        }
    }
    
    submitForm(firstNameValid, lastNameValid, cpfValid, userValid, password1Valid, password2Valid) {
        const registerValid = (firstNameValid && lastNameValid && cpfValid && userValid && password1Valid && password2Valid);

        if(registerValid) {
            alert('Cadastro enviado com sucesso.');
            this.form.submit();
        }
        
    }

    validateRegister() {
        this.clearP();
        
        const firstNameValid = this.validateFirstName();
        const lastNameValid= this.validateLastName();
        const cpfValid = this.validateCPF();
        const userValid = this.validateUser();
        const password1Valid = this.validatePassword1();
        const password2Valid = this.validatePassword2();

        this.submitForm(firstNameValid, lastNameValid, cpfValid, userValid, password1Valid, password2Valid);
    }
    
    static createP() {
        return document.createElement('p');
    }
    
    static sayRequired(tag, text = 'Campo obrigatório.') {
        const p = Register.createP();
        p.innerText = text
        tag.appendChild(p);
    }
    
    validateFirstName() {
        if(!this.firstName) {
            Register.sayRequired(this.firstNameDiv);
            return false;
        }
        
        return true;
    }
    
    validateLastName() {
        if(!this.lastName) {
            Register.sayRequired(this.lastNameDiv);
            return false;
        }
        
        return true;
    }
    
    static createDigit(string) {
        const array = Array.from(string);
        
        let multiplier = array.length + 1;
        const add = array.reduce(function(counter, value) {
            counter += value * multiplier;
            multiplier--;
            
            return counter;
        }, 0);
        
        const number = 11 - (add % 11);
        
        return number > 9 ? '0' : String(number);
    }
    
    createCpfCopy() {
        let cpfCopy = this.cpf.slice(0, -2);
        
        const firstDigit = Register.createDigit(cpfCopy);
        cpfCopy += firstDigit;
        const secondDigit = Register.createDigit(cpfCopy);
        cpfCopy += secondDigit;
        
        return cpfCopy;
    }
    
    isSequencial() {
        return this.cpf[0].repeat(this.cpf.length) === this.cpf;
    }

    validateCPF() {
        if(!this.cpf) {
            Register.sayRequired(this.cpfDiv);
            return false;
        } else if(this.isSequencial()) {
            Register.sayRequired(this.cpfDiv, 'CPF não pode ser uma sequência.');
            return false;
        }
        if(this.cpf.length !== 11) {
            Register.sayRequired(this.cpfDiv, 'CPF incompleto.');
            return false;
        }
        
        const cpfCopy = this.createCpfCopy();
        if(cpfCopy !== this.cpf) {
            Register.sayRequired(this.cpfDiv, 'CPF inválido.');
            return false;
        }
        
        return true;
    }
    
    validateUser() {
        if(!this.user) {
            Register.sayRequired(this.userDiv);
            return false;
        }
        if(this.haveEspecialChar(this.user)) {
            Register.sayRequired(this.userDiv, 'Usuário não pode conter caracteres especiais.');
            return false;
        }
        if(this.user.length > 12 || this.user.length < 3) {
            Register.sayRequired(this.userDiv, 'Usuário deve ter entre 3 e 12 caracteres.');
            return false;
        }

        return true;
    }

    haveNumber(atribute) {
        const r = atribute.search(/\d/);
        return r !== -1;
    }

    haveUpperCase(atribute) {
        const r = atribute.search(/[A-Z]/);
        return r !== -1;
    }

    haveEspecialChar(atribute) {
        const r = atribute.search(/[^a-zA-Z0-9]/);
        return r !== -1;
    }
    
    validatePassword1() {
        if(!this.password1) {
            Register.sayRequired(this.password1Div);
            return false;
        }
        if(!this.haveUpperCase(this.password1)) {
            Register.sayRequired(this.password1Div, 'Senha deve conter letras maiúsculas.');
            return false;
        }
        if(!this.haveNumber(this.password1)) {
            Register.sayRequired(this.password1Div, 'Senha deve conter números.');
            return false;
        }
        if(!this.haveEspecialChar(this.password1)) {
            Register.sayRequired(this.password1Div, 'Senha deve conter caracteres especiais.');
            return false;
        }
        if(this.password1.length > 12 || this.password1.length < 8) {
            Register.sayRequired(this.password1Div, 'Senha deve ter entre 8 e 12 caracteres.');
            return false;
        }

        return true;
    }
    
    validatePassword2() {
        if(!this.password2) {
            Register.sayRequired(this.password2Div);
            return false;
        }
        if(this.password1 !== this.password2) {
            Register.sayRequired(this.password2Div, 'As senhas precisam ser iguais.')
            Register.sayRequired(this.password1Div, 'As senhas precisam ser iguais.')
            return false;
        }

        return true;
    }
}

const register = new Register();
