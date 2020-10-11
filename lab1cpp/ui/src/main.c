#include <iostream>
#include <string>
#include "lib.h"

const std::string ABOUT_MESSAGE = "Euler’s Totient Function";
const std::string ENTER_MESSAGE = "Enter non-zero number> ";
const std::string INCORRECT_MESSAGE = "Incorrect data";
const std::string CONTINUE_MESSAGE = "Continue?(Y/N)> ";
const std::string YES_ANSWER = "Y";
const std::string NO_ANSWER = "N";
const std::string INCORRECT_ANSWER_MESSAGE = "Incorrect data";

typedef INT (*COUNT_DIVISORS)(CONST INT);

bool is_number(const std::string &s)
{
    if (s.empty())
        return false;
    for (int i = 0; i < s.length(); ++i)
    {
        if (i == 0 && !(s[i] == '-' || isdigit(s[i])))
        {
            return false;
        }
        else if (i != 0 && !isdigit(s[i]))
        {
            return false;
        }
    }
    return true;
}

int get_number(const std::string &s)
{
    return std::stoi(s);
}

int main()
{
        std::cout << FEATURE_MESSAGE << "\n";

        boolean does_continue = true;
        while (does_continue)
        {
            std::string str;
            std::cout << ENTER_MESSAGE;
            std::cin >> str;
            if (is_number(str))
            {
                int number = get_number(str);
                if (number != 0)
                {
                    std::cout << phi(number) << "\n";
                }
                else
                {
                    std::cout << INCORRECT_MESSAGE << "\n";
                }
            }
            else
            {
                std::cout << INCORRECT_MESSAGE << "\n";
            }

            while (true)
            {
                std::string answer;
                std::cout << CONTINUE_MESSAGE;
                std::cin >> answer;
                std::transform(str.begin(), str.end(), str.begin(), ::toupper);

                if (answer == NO_ANSWER)
                {
                    does_continue = false;
                    break;
                }
                else if (answer == YES_ANSWER)
                {
                    break;
                }
                else
                {
                    std::cout << INCORRECT_ANSWER_MESSAGE << "\n";
                }
            }
        }
        FreeLibrary(hDLL);
    }
}
