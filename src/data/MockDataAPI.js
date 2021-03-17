import {Text} from 'react-native';
import React, {Component} from 'react';
import {recipes, categories} from './dataArrays';

/* export function getCategoryName(categoryId) {
  let name;
  categories.map(data => {
    if (data.id == categoryId) {
      name = data.name;
    }
  });
  return name;
} */

export function getRecipes(categoryId) {
    const recipesArray = [];
    recipes.map((data) => {
        if (data.categoryId == categoryId) {
            recipesArray.push(data);
        }
    });
    return recipesArray;
}
