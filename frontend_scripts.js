function changeInputs(value, variable) {
    switch (value) {
        case "3":
            switch (variable) {
                case "maxInputs":
                    maxInputs = 3;
                    box4.style.display = 'none';
                    initializePage();
                    break;
                case "findBoxInputs":
                    findBoxInputs = 3;
                    break;
                default:
                    break;
            }

            break;
        case "4":
            switch (variable) {
                case "maxInputs":
                    maxInputs = 4;
                    box4.style.display = 'revert';
                    initializePage();
                    break;
                case "findBoxInputs":
                    findBoxInputs = 4;
                    break;
                default:
                    break;
                break;
        }
        default:
            break;
    }
}