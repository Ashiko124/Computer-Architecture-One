/**
 * LS-8 v2.0 emulator skeleton code
 */

 const LDI = 0b10011001;
 const PRN = 0b01000011;
 const HLT = 0b00000001;
 const MUL = 0b10101010;
 const PUSH = 0b01001101;
 const POP = 0b01001100;


 const SP=7;
/**
 * Class for simulating a simple Computer (CPU & memory)
 */
class CPU {

    /**
     * Initialize the CPU
     */
    constructor(ram) {
        this.ram = ram;

        this.reg = new Array(8).fill(0); // General-purpose registers R0-R7
        
        this.reg[SP] = 0xF4;

        // Special-purpose registers
        this.PC = 0; // Program Counter
        let E = 0; //equal = false
        let L = 0; // less = false
        let G = 0; // great = false
    }
    
    /**
     * Store value in memory address, useful for program loading
     */
    poke(address, value) {
        this.ram.write(address, value);
    }

    /**
     * Starts the clock ticking on the CPU
     */
    startClock() {
        this.clock = setInterval(() => {
            this.tick();
        }, 1); // 1 ms delay == 1 KHz clock == 0.000001 GHz
    }

    /**
     * Stops the clock
     */
    stopClock() {
        clearInterval(this.clock);
    }

    /**
     * ALU functionality
     *
     * The ALU is responsible for math and comparisons.
     *
     * If you have an instruction that does math, i.e. MUL, the CPU would hand
     * it off to it's internal ALU component to do the actual work.
     *
     * op can be: ADD SUB MUL DIV INC DEC CMP
     */
    alu(op, regA, regB) {
        switch (op) {
            case 'MUL':
                // !!! IMPLEMENT ME
                this.reg[regA] = (this.reg[regB] * this.reg[regA]) & 0xff;
                break;
        }
    }

    /**
     * Advances the CPU one cycle
     */
    tick() {
        // Load the instruction register (IR--can just be a local variable here)
        // from the memory address pointed to by the PC. (I.e. the PC holds the
        // index into memory of the instruction that's about to be executed
        // right now.)
        const IR = this.ram.read(this.PC);

        // !!! IMPLEMENT ME

        // Debugging output
        //console.log(`${this.PC}: ${IR.toString(2)}`);

        // Get the two bytes in memory _after_ the PC in case the instruction
        // needs them.
        const operandA = this.ram.read(this.PC + 1);
        const operandB = this.ram.read(this.PC + 2);
        // !!! IMPLEMENT ME

        // Execute the instruction. Perform the actions for the instruction as
        // outlined in the LS-8 spec.

        switch(IR) {
            case LDI:
                // set the value in a register
                this.reg[operandA] = operandB;
                this.PC +=3;
                break;
            case PRN:
                console.log(this.reg[operandA]);
                this.PC +=2;
                break;
            case HLT:
                this.stopClock();
                this.PC +=1;
                break;
            case MUL:
                this.alu("MUL", operandA, operandB);
                this.PC +=3;
                break;
            case PUSH:
                this.reg[SP]--;
                this.ram.write(this.reg[SP], this.reg[operandA]);
                this.PC +=2;
                break;
            case POP:
                this.reg[operandA] = this.ram.read(this.reg[SP]);
                this.reg[SP]++; 
                this.PC +=2;
                break;
            // Add the CMP instruction and equal flag to your LS-8.
            case CMP:
                if(this.reg[operandA] === this.reg[operandB]) {
                    E = 1;
                } else {
                    E = 0;
                } 
                if(this.reg[operandA] > this.reg[operandB]) {
                    G = 1;   
                } else {
                    G = 0;
                }
                if(this.reg[operandA] < this.reg[operandB]) {
                    L = 1;    
                } else {
                    L = 0;
                }
                this.PC +=3;
                break;
            case JMP:
                IR = this.reg[operandA];
                break;
            case JEQ:
                if( E === 1) {
                    this.PC = this.reg[operandA];
                }
                break;
            case JNE:
                if( E === 0) {
                    this.PC = this.reg[operandA];
                }
                break;
            default:
                console.log("This is not an instruction " + IR.toString(2));
                this.stopClock();
                return;
        }


        // !!! IMPLEMENT ME

        // Increment the PC register to go to the next instruction. Instructions
        // can be 1, 2, or 3 bytes long. Hint: the high 2 bits of the
        // instruction byte tells you how many bytes follow the instruction byte
        // for any particular instruction.
        
        // !!! IMPLEMENT ME
    }
}

module.exports = CPU;
